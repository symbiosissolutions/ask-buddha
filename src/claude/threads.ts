import Anthropic from "@anthropic-ai/sdk";
import { BUDDHA_PROMPT_TEMPLATE } from "../prompts/promptTemplate";

// Define types for message structure and thread management
// Who sent the message and content of the message

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// Thread structure with unique ID and array of messages
interface Thread {
  id: string;
  messages: ConversationMessage[];
}

// Store for maintaining conversation threads
const threadsStore = new Map<string, Thread>();

/**
 * Creates a new conversation thread with unique ID
 * @param _client - Anthropic client instance (unused but kept for consistent interface)
 */

function createThreadWith(_client: Anthropic) {
  return async function () {
    const threadId = Date.now().toString();
    // Initialize new thread with empty message array
    threadsStore.set(threadId, {
      id: threadId,
      messages: [],
    });
    return { id: threadId };
  };
}

// Creates a new message in specified thread
function createMessageInThreadWith(_client: Anthropic) {
  return async function (threadId: string, content: string) {
    const thread = threadsStore.get(threadId);
    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }

    // Add user message to thread history
    thread.messages.push({
      role: "user",
      content,
    });

    // Return message in format compatible with OpenAI's structure
    return {
      id: Date.now().toString(),
      content: [{ type: "text", text: content }],
    };
  };
}

//Processes the thread with Claude and gets a response
function createRunWith(client: Anthropic) {
  return async function (threadId: string) {
    const thread = threadsStore.get(threadId);
    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }

    try {
      // Send conversation to Claude and get response
      const response = await client.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: thread.messages,
        system: BUDDHA_PROMPT_TEMPLATE,
      });

      // Add Claude's response to the thread
      if (response.content[0].type === "text") {
        thread.messages.push({
          role: "assistant",
          content: response.content[0].text,
        });
      }

      return response;
    } catch (error) {
      console.error("Error in Claude API call:", error);
      throw error;
    }
  };
}

// Retrieves all messages from a thread
function listMessagesWith(_client: Anthropic) {
  return async function (threadId: string) {
    const thread = threadsStore.get(threadId);

    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }

    // Format messages to match OpenAI's response structure
    return {
      data: thread.messages.map((message) => ({
        content: [
          {
            type: "text" as const,
            text: message.content,
          },
        ],
      })),
    };
  };
}

// Creates a Claude API client with methods matching OpenAI's interface
export function claudeClient(apiKey: string) {
  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey,
    // Set to true to allow API calls from browser
    dangerouslyAllowBrowser: true,
  });

  // Return object with all available operations
  return {
    createThread: createThreadWith(anthropic),
    createMessageInThread: createMessageInThreadWith(anthropic),
    createRun: createRunWith(anthropic),
    listMessages: listMessagesWith(anthropic),
  };
}

/* Example usage:
async function example() {
  // Initialize client
  const client = claudeClient('your-api-key');
  
  // Start new conversation
  const thread = await client.createThread();
  
  // Send user message
  await client.createMessageInThread(thread.id, "What is the path to enlightenment?");
  
  // Get Claude's response
  const response = await client.createRun(thread.id, "");
  
  // Get conversation history
  const messages = await client.listMessages(thread.id);
}
*/
