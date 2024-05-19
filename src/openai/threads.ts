import OpenAI from "openai";

export function openaiClient(apiKey: string) {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  return {
    createThread: createThreadWith(openai),
    createMessageInThread: createMessageInThreadWith(openai),
    createRun: createRunWith(openai),
    listMessages: listMessagesWith(openai),
  };
}

function createThreadWith(client: OpenAI) {
  return async function () {
    return await client.beta.threads.create();
  };
}

function createMessageInThreadWith(client: OpenAI) {
  return async function (threadId: string, content: string) {
    return await client.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  };
}

function createRunWith(client: OpenAI) {
  return async function (threadId: string, assistantId: string) {
    return await client.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });
  };
}

function listMessagesWith(client: OpenAI) {
  return async function (threadId: string) {
    return await client.beta.threads.messages.list(threadId);
  };
}
