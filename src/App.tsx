import { FormEvent, useEffect, useRef, useState } from "react";
import { claudeClient } from "./claude/threads";
// import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { v4 as uuidv4 } from "uuid";
import { API_KEY } from "./constants/config";
import { ROLES, ROLE_LABELS } from "./constants/enums";
import appBackground from "./assets/ask-buddha-bg-min.jpg";
import "./App.css";
import { DISCLAIMER_TEXT, INTRODUCTION_TEXT } from "./constants/content";
import { TypingIndicator } from "./components/TypingIndicator";

type TMessage = {
  id: string;
  role: `${ROLES}`;
  content: string;
};
const assistant = claudeClient(API_KEY);

function App() {
  const [threadId, setThreadId] = useState<string | undefined>();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [appInitializing, setAppInitializing] = useState(true);
  const [loadingAssistantResponse, setLoadingAssistantResponse] =
    useState(false);
  const [userInput, setUserInput] = useState("");
  const chatboxRef = useRef<HTMLDivElement>(null);

  const init = async () => {
    setAppInitializing(true);
    const thread = await assistant.createThread();
    setThreadId(thread.id);
    setAppInitializing(false);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageAndGetResponse = async (message: string) => {
    if (threadId !== undefined) {
      await sendAndProcess();
      const response = await getResponse();
      return response;
      // return await getResponse();
    }

    async function sendAndProcess() {
      if (threadId !== undefined) {
        await assistant.createMessageInThread(threadId, message);
        await assistant.createRun(threadId);
      }
    }

    //   async function getResponse() {
    //     if (threadId !== undefined) {
    //       const allMessagesInThread = await assistant.listMessages(threadId);
    //       const lastResponse = allMessagesInThread.data[0].content[0] as unknown as TextContentBlock;
    //       return lastResponse.text.value;
    //     }
    //   }

    async function getResponse() {
      if (threadId !== undefined) {
        const allMessagesInThread = await assistant.listMessages(threadId);

        // Ensure data exists and has the expected structure
        const lastMessage = allMessagesInThread?.data?.slice(-1)[0];
        if (!lastMessage || !lastMessage.content?.[0]?.text) {
          console.error("Error: Response structure is unexpected or missing.");
          return "I'm sorry, I could not process your message.";
        }

        return lastMessage.content[0].text;
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

  const clearChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessages([]);
    await init();
  };

  return (
    <>
      {appInitializing ? <div className="loader"></div> : <></>}
      <div
        className={`screen ${appInitializing ? "loading" : ""}`}
        style={{ backgroundImage: `url(${appBackground})` }}
      >
        <div className="screen-main">
          <div className="chat-section">
            <div className="chatbox curved custom-scroll" ref={chatboxRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message curved ${message.role}`}
                >
                  <div className="message-author">
                    <div className="message-author-avatar"></div>
                    <h4 className="message-author-role">
                      {ROLE_LABELS[message.role]}
                    </h4>
                  </div>
                  <p className="message-content">{message.content}</p>
                </div>
              ))}
              {loadingAssistantResponse && (
                <div className={`message curved assistant`}>
                  <TypingIndicator />
                </div>
              )}
            </div>
            <form id="chat-form" onSubmit={handleSubmit} className="curved">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={loadingAssistantResponse}
                placeholder="What would you like to ask Buddha today?"
              />
              <button
                type="submit"
                className="submit-chat"
                disabled={loadingAssistantResponse}
              ></button>
              <button
                type="button"
                className="clear-chat"
                onClick={clearChat}
              ></button>
            </form>
          </div>
          <div className="about-section curved custom-scroll">
            <h1>About Me</h1>
            <div dangerouslySetInnerHTML={{ __html: INTRODUCTION_TEXT }}></div>
          </div>
        </div>
        <div className="screen-disclaimer">
          <p>{DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </>
  );
}

export default App;
