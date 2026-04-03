import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

import { ROLES, ROLE_LABELS } from "./constants/enums";
import { DISCLAIMER_TEXT, GREETING_TEXT } from "./constants/content";

import appBackground from "./assets/buddha-bg-img.jpg";
import videoBackground from "./assets/buddha-bg.mp4";

import "./App.css";

import { TypingIndicator } from "./components/TypingIndicator";
import Navbar from "./components/Navbar";

type TMessage = {
  id: string;
  role: `${ROLES}`;
  content: string;
  format?: "markdown" | "text";
};

type TextSizeOption = "small" | "medium" | "large";

const API_URL = import.meta.env.VITE_CHAT_API_URL;
const API_KEY = import.meta.env.VITE_CHAT_API_KEY;

function App() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [integrationError, setIntegrationError] = useState<string | undefined>();
  const [appInitializing, setAppInitializing] = useState(true);
  const [loadingAssistantResponse, setLoadingAssistantResponse] =
    useState(false);
  const [userInput, setUserInput] = useState("");

  const chatboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(true);
  const [textSize, setTextSize] = useState<TextSizeOption>("medium");

  const greeting = GREETING_TEXT;

  // ✅ Initialize app
  const init = useCallback(async () => {
    setAppInitializing(true);
    setIntegrationError(undefined);

    const savedMessages = localStorage.getItem("ask-buddha-messages");
    if (savedMessages && JSON.parse(savedMessages).length > 0) {
      setMessages(JSON.parse(savedMessages));
    } else if (greeting) {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content: greeting,
          format: "markdown",
        },
      ]);
    }

    setAppInitializing(false);
  }, [greeting]);

  useEffect(() => {
    init();
  }, [init]);

  // ✅ Save messages to local storage
  useEffect(() => {
    if (!appInitializing) {
      localStorage.setItem("ask-buddha-messages", JSON.stringify(messages));
    }
  }, [messages, appInitializing]);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!appInitializing && !loadingAssistantResponse) {
      inputRef.current?.focus();
    }
  }, [appInitializing, loadingAssistantResponse]);

  const handleTextSizeChange = (size: TextSizeOption) => {
    setTextSize(size);
    document.documentElement.style.setProperty(
      "--text-size-factor",
      size === "small" ? "0.875" : size === "large" ? "1.125" : "1"
    );
  };

  // ✅ API call
  const callChatAPI = async (messages: TMessage[]) => {
    if (!API_URL) {
      throw new Error("API URL not configured in .env");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from API");
    }
    // ✅ Parse JSON instead of text
    const data = await response.json();

    const formatted_text = data.replace(/\\n/g, "\n");

    return formatted_text;
  };

  // ✅ Handle submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIntegrationError(undefined);

    if (!userInput.trim()) return;

    const newUserMessage: TMessage = {
      id: uuidv4(),
      content: userInput,
      role: "user",
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    setUserInput("");
    setLoadingAssistantResponse(true);

    let assistantResponse: string;

    try {
      assistantResponse = await callChatAPI(updatedMessages);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error calling API.";
      setIntegrationError(message);
      assistantResponse = `**Error:** ${message}`;
    }

    // ✅ Append assistant response
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: uuidv4(),
        content: assistantResponse,
        role: "assistant",
        format: "markdown",
      },
    ]);

    setLoadingAssistantResponse(false);
  };

  // ✅ Clear chat
  const clearChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem("ask-buddha-messages");
    setMessages([]);
    await init();
  };

  return (
    <>
      {appInitializing ? <div className="loader"></div> : <></>}
      <Navbar
        onTextSizeChange={handleTextSizeChange}
        currentTextSize={textSize}
      />

      <div
        className={`screen ${appInitializing ? "loading" : ""} background-image`}
        style={!videoLoaded ? { backgroundImage: `url(${appBackground})` } : {}}
      >
        {videoLoaded && (
          <video
            className="background-video"
            autoPlay
            loop
            muted
            playsInline
            poster={appBackground}
            onError={() => setVideoLoaded(false)}
          >
            <source src={videoBackground} type="video/mp4" />
          </video>
        )}

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

                  <div className="message-content">
                    {message.format === "markdown" ? (
                      <Markdown>{message.content}</Markdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {loadingAssistantResponse && (
                <div className="message curved assistant">
                  <TypingIndicator />
                </div>
              )}
            </div>

            <form id="chat-form" onSubmit={handleSubmit} className="curved">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={loadingAssistantResponse || !!integrationError}
                placeholder="What would you like to ask Buddha today?"
                ref={inputRef}
              />

              <button
                type="submit"
                className="submit-chat"
                title="Submit"
                disabled={loadingAssistantResponse || !!integrationError}
              ></button>

              <button
                type="button"
                className="clear-chat"
                title="Clear Chat"
                onClick={clearChat}
              ></button>
            </form>
          </div>
        </div>

        <div className="screen-disclaimer">
          <p>{integrationError ?? DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </>
  );
}

export default App;
