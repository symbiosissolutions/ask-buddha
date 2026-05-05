import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ROLES } from "../constants/enums";
import { DISCLAIMER_TEXT, GREETING_TEXT } from "../constants/content";

import "../App.css";

import { TypingIndicator } from "../components/TypingIndicator";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import Navbar from "../components/Navbar";
import { startVisit, endVisit } from "../api/client";
import { getAccessData } from "../hooks/useAccessGuard";

type TMessage = {
  id: string;
  role: `${ROLES}`;
  content: string;
  format?: "markdown" | "text";
};

type TextSizeOption = "small" | "medium" | "large";

const API_URL = import.meta.env.VITE_CHAT_API_URL;
const API_KEY = import.meta.env.VITE_CHAT_API_KEY;

function Chat() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [integrationError, setIntegrationError] = useState<string | undefined>();
  const [appInitializing, setAppInitializing] = useState(true);
  const [loadingAssistantResponse, setLoadingAssistantResponse] = useState(false);
  const [userInput, setUserInput] = useState("");

  const chatboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const visitIdRef = useRef<string | null>(null);
  const [textSize, setTextSize] = useState<TextSizeOption>("medium");

  const greeting = GREETING_TEXT;

  // Create a visit each time user is active, end it when they leave
  useEffect(() => {
    const accessData = getAccessData();
    if (!accessData?.userSessionId || !accessData?.sessionKey) return;

    const { userSessionId, sessionKey } = accessData;
    let active = true;

    const beginVisit = () => {
      startVisit(userSessionId, sessionKey)
        .then(({ visitId }) => {
          // active=false means StrictMode cleanup already ran — orphan visit, ignored in stats
          if (active && !visitIdRef.current) visitIdRef.current = visitId;
        })
        .catch(() => {});
    };

    const endCurrentVisit = () => {
      if (visitIdRef.current) {
        endVisit(visitIdRef.current);
        visitIdRef.current = null;
      }
    };

    beginVisit();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        endCurrentVisit();
      } else if (document.visibilityState === "visible" && !visitIdRef.current) {
        // User came back — start a new visit
        beginVisit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      endCurrentVisit();
    };
  }, []);

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

    const data = await response.json();
    return data.replace(/\\n/g, "\n");
  };

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
        error instanceof Error ? error.message : "Unexpected error calling API.";
      setIntegrationError(message);
      assistantResponse = `**Error:** ${message}`;
    }

    setMessages((current) => [
      ...current,
      {
        id: uuidv4(),
        content: assistantResponse,
        role: "assistant",
        format: "markdown",
      },
    ]);

    setLoadingAssistantResponse(false);
  };

  const clearChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem("ask-buddha-messages");
    setMessages([]);
    await init();
  };

  return (
    <>
      {appInitializing && <div className="loader" />}
      <Navbar onTextSizeChange={handleTextSizeChange} currentTextSize={textSize} />

      <div className={`screen ${appInitializing ? "loading" : ""}`}>
        <div className="screen-main">
          <div className="chat-section">
            <div
              className="chatbox"
              ref={chatboxRef}
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  format={message.format}
                />
              ))}

              {loadingAssistantResponse && <TypingIndicator />}
            </div>

            <ChatInput
              value={userInput}
              onChange={setUserInput}
              onSubmit={handleSubmit}
              onClear={clearChat}
              disabled={loadingAssistantResponse || !!integrationError}
              inputRef={inputRef}
            />
          </div>
        </div>

        <div className="screen-disclaimer">
          <p>{integrationError ?? DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </>
  );
}

export default Chat;
