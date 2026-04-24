import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ROLES } from "./constants/enums";
import { DISCLAIMER_TEXT, GREETING_TEXT, CREATE_MIND_MAP_GREETING} from "./constants/content";

import "./App.css";

import { TypingIndicator } from "./components/TypingIndicator";
import { MessageBubble } from "./components/MessageBubble";
import { ChatInput } from "./components/ChatInput";
import Navbar from "./components/Navbar";
import DiscoverPanel from "./components/DiscoverPanel";
import SidebarRail from "./components/SidebarRail";
import { ActivityType } from "./constants/activities";

type TMessage = {
  id: string;
  role: `${ROLES}`;
  content: string;
  format?: "markdown" | "text";
};

type TextSizeOption = "small" | "medium" | "large";

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;
const API_KEY = import.meta.env.VITE_CHAT_API_KEY;

function App() {
  const [allMessages, setAllMessages] = useState<Record<ActivityType, TMessage[]>>({
    chat: [],
    "mind-map": [],
  });
  const [integrationError, setIntegrationError] = useState<string | undefined>();
  const [appInitializing, setAppInitializing] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState<Set<ActivityType>>(new Set());
  const [userInput, setUserInput] = useState("");

  const chatboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [textSize, setTextSize] = useState<TextSizeOption>("medium");
  const [currentActivity, setCurrentActivity] = useState<ActivityType>("chat");
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default to collapsed as requested earlier

  const init = useCallback(async () => {
    setAppInitializing(true);
    setIntegrationError(undefined);

    const activities: ActivityType[] = ["chat", "mind-map"];
    const loadedMessages: Record<ActivityType, TMessage[]> = { chat: [], "mind-map": [] };

    activities.forEach((act) => {
      const storageKey = `ask-buddha-messages-${act}`;
      const saved = localStorage.getItem(storageKey);
      const greeting = act === "mind-map" ? CREATE_MIND_MAP_GREETING : GREETING_TEXT;

      if (saved && JSON.parse(saved).length > 0) {
        loadedMessages[act] = JSON.parse(saved);
      } else if (greeting) {
        loadedMessages[act] = [
          {
            id: uuidv4(),
            role: "assistant",
            content: greeting,
            format: "markdown",
          },
        ];
      }
    });

    setAllMessages(loadedMessages);
    setAppInitializing(false);
  }, []);

  const messages = allMessages[currentActivity] || [];

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!appInitializing) {
      Object.entries(allMessages).forEach(([act, msgs]) => {
        localStorage.setItem(`ask-buddha-messages-${act}`, JSON.stringify(msgs));
      });
    }
  }, [allMessages, appInitializing]);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!appInitializing && !loadingActivities.has(currentActivity)) {
      inputRef.current?.focus();
    }
  }, [appInitializing, loadingActivities, currentActivity]);

  const handleTextSizeChange = (size: TextSizeOption) => {
    setTextSize(size);
    document.documentElement.style.setProperty(
      "--text-size-factor",
      size === "small" ? "0.875" : size === "large" ? "1.125" : "1"
    );
  };

  const callChatAPI = async (messages: TMessage[]) => {
    const action = currentActivity === "mind-map" ? "mind_map" : "chat";
    const apiUrl = `${CHAT_API_URL}/${action}`;
    
    if (!CHAT_API_URL) {
      throw new Error(`API URL not configured in .env`);
    }

    const response = await fetch(apiUrl, {
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

    const activityAtStart = currentActivity;
    const updatedMessages = [...messages, newUserMessage];
    
    setAllMessages(prev => ({
      ...prev,
      [activityAtStart]: updatedMessages
    }));
    
    setUserInput("");
    setLoadingActivities(prev => new Set(prev).add(activityAtStart));

    let assistantResponse: string;

    try {
      assistantResponse = await callChatAPI(updatedMessages);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error calling API.";
      setIntegrationError(message);
      assistantResponse = `**Error:** ${message}`;
    }

    const assistantMsg: TMessage = {
      id: uuidv4(),
      content: assistantResponse,
      role: "assistant",
      format: "markdown",
    };

    setAllMessages(prev => ({
      ...prev,
      [activityAtStart]: [...prev[activityAtStart], assistantMsg]
    }));

    setLoadingActivities(prev => {
      const next = new Set(prev);
      next.delete(activityAtStart);
      return next;
    });
  };

  const clearChat = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    const storageKey = `ask-buddha-messages-${currentActivity}`;
    localStorage.removeItem(storageKey);
    setAllMessages(prev => ({
      ...prev,
      [currentActivity]: []
    }));
    await init();
  };

  return (
    <>
      {appInitializing && <div className="loader" />}

      <div className={`screen ${appInitializing ? "loading" : ""}`}>
        <Navbar 
          onTextSizeChange={handleTextSizeChange} 
          currentTextSize={textSize} 
        />
        <div className={`main-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <SidebarRail 
            isDiscoverOpen={isDiscoverOpen}
            onToggleDiscover={() => setIsDiscoverOpen(!isDiscoverOpen)}
            onHomeClick={() => { setCurrentActivity('chat'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onNewChatClick={() => clearChat()}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapsed={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <DiscoverPanel 
            currentActivity={currentActivity} 
            onActivitySelect={setCurrentActivity} 
            isOpen={isDiscoverOpen}
          />
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

                {loadingActivities.has(currentActivity) && <TypingIndicator />}
              </div>

              <ChatInput
                value={userInput}
                onChange={setUserInput}
                onSubmit={handleSubmit}
                onClear={clearChat}
                disabled={loadingActivities.has(currentActivity) || !!integrationError}
                inputRef={inputRef}
              />
            </div>
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
