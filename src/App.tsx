import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import { openaiClient } from "./openai/threads";
import { API_KEY, ASSISTANT_ID } from "./constants/config";
import { ROLES } from "./constants/enums";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { v4 as uuidv4 } from "uuid";

type TMessage = {
  id: string;
  role: `${ROLES}`;
  content: string;
};

const assistant = openaiClient(API_KEY);

function App() {
  const [threadId, setThreadId] = useState<string | undefined>();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [appInitializing, setAppInitializing] = useState(true);
  const [loadingAssistantResponse, setLoadingAssistantResponse] =
    useState(false);
  const [userInput, setUserInput] = useState("");

  const init = async () => {
    setAppInitializing(true);
    const thread = await assistant.createThread();
    setThreadId(thread.id);
    setAppInitializing(false);
  };

  useEffect(() => {
    init();
    return () => {
      setThreadId(undefined);
      setMessages([]);
      setUserInput("");
    };
  }, []);

  const sendMessageAndGetResponse = async (message: string) => {
    if (threadId !== undefined) {
      await sendAndProcess();
      return await getResponse();
    }

    async function sendAndProcess() {
      if (threadId !== undefined) {
        await assistant.createMessageInThread(threadId, message);
        await assistant.createRun(threadId, ASSISTANT_ID);
      }
    }

    async function getResponse() {
      if (threadId !== undefined) {
        const allMessagesInThread = assistant.listMessages(threadId);
        const lastResponse = (await allMessagesInThread).data[0]
          .content[0] as TextContentBlock;
        return lastResponse.text.value;
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: uuidv4(),
        content: userInput,
        role: "user",
      },
    ]);
    setUserInput("");
    setLoadingAssistantResponse(true);
    const assistantResponse = await sendMessageAndGetResponse(userInput);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: uuidv4(),
        content: assistantResponse as string,
        role: "assistant",
      },
    ]);
    setLoadingAssistantResponse(false);
  };

  return (
    <div>
      {appInitializing ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <>
          <div className="chatbox">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <p>{message.content}</p>
              </div>
            ))}
            {loadingAssistantResponse && (
              <div className={`message assistant`}>
                <p>...</p>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loadingAssistantResponse}
              placeholder="What would you like to ask Buddha today?"
            />
            <button type="submit" disabled={loadingAssistantResponse}>Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
