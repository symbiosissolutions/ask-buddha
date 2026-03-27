import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

import { anthropicBedrockClient, Message as BedrockMessage } from "./bedrock/thread";

import { v4 as uuidv4 } from "uuid";

import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BEDROCK_AWS_REGION,
  BEDROCK_MAX_TOKENS,
  BEDROCK_MODEL_ID,
} from "./constants/config";
import { ROLES, ROLE_LABELS } from "./constants/enums";
import { DISCLAIMER_TEXT, GREETING_TEXT } from "./constants/content";
import { BUDDHA_PROMPT_TEMPLATE } from "./prompts/promptTemplate";

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

const bedrockAuth =
  AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

const assistant =
  BEDROCK_AWS_REGION && BEDROCK_MODEL_ID
    ? anthropicBedrockClient(BEDROCK_AWS_REGION, BEDROCK_MODEL_ID, {
        auth: bedrockAuth,
        maxTokens: BEDROCK_MAX_TOKENS,
        system: BUDDHA_PROMPT_TEMPLATE,
      })
    : undefined;

function App() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [bedrockHistory, setBedrockHistory] = useState<BedrockMessage[]>([]);
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

  const init = useCallback(async () => {
    setAppInitializing(true);
    setIntegrationError(undefined);

    if (greeting) {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content: greeting,
        },
      ]);
    }

    if (!assistant) {
      const message =
        "Bedrock is not configured. Set VITE_BEDROCK_AWS_REGION and VITE_BEDROCK_MODEL_ID.";
      setIntegrationError(message);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: uuidv4(),
          role: "assistant",
          content: `**Error:** ${message}`,
          format: "markdown",
        },
      ]);
      setAppInitializing(false);
      return;
    }

    try {
      const history = assistant.createThread();
      setBedrockHistory(history);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to initialize Bedrock.";
      setIntegrationError(message);
    }
    setAppInitializing(false);
  }, [greeting]);

  useEffect(() => {
    init();
  }, [init]);

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
    // Apply text size to the document
    document.documentElement.style.setProperty(
      "--text-size-factor",
      size === "small" ? "0.875" : size === "large" ? "1.125" : "1",
    );
  };

  const sendMessageAndGetResponse = async (message: string) => {
    if (!assistant) {
      throw new Error(
        "Bedrock is not configured. Set VITE_BEDROCK_AWS_REGION and VITE_BEDROCK_MODEL_ID.",
      );
    }

    const { text, updatedHistory } = await assistant.sendMessage(
      bedrockHistory,
      message,
    );
    setBedrockHistory(updatedHistory);
    return text;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIntegrationError(undefined);
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
    let assistantResponse: string;
    try {
      assistantResponse = (await sendMessageAndGetResponse(userInput)) as string;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error calling Bedrock.";
      setIntegrationError(message);
      assistantResponse = `**Error:** ${message}`;
    }
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

  const clearChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessages([]);
    setBedrockHistory([]);
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
            // style={{ zIndex: 1 }}
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
