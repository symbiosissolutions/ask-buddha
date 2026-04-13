import { useState, useEffect } from "react";

import "../navbar.css";

import { ABOUT_APP_TEXT } from "../constants/content";

import { FiMenu, FiX, FiActivity, FiMessageSquare, FiMap } from "react-icons/fi";
import { FaInfo } from "react-icons/fa";
import { RxFontSize } from "react-icons/rx";

import logo from "../assets/logo.png";

type TextSizeOption = "small" | "medium" | "large";
type ActivityType = "chat" | "mind-map";

interface NavbarProps {
  onTextSizeChange: (size: TextSizeOption) => void;
  currentTextSize: TextSizeOption;
  onActivitySelect: (activity: ActivityType) => void;
  currentActivity: ActivityType;
}

const Navbar = ({
  onTextSizeChange,
  currentTextSize = "medium",
  onActivitySelect,
  currentActivity,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "activities">("info");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".side-panel") &&
        !target.closest(".hamburger-btn") &&
        !target.closest(".activities-nav-btn") &&
        !target.closest(".side-panel-overlay")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleSidebar = (tab: "info" | "activities" = "info") => {
    if (!isOpen) {
      setActiveTab(tab);
      setIsOpen(true);
    } else if (activeTab === tab) {
      setIsOpen(false);
    } else {
      setActiveTab(tab);
    }
  };

  const handleTextSizeChange = (size: TextSizeOption) => {
    onTextSizeChange(size);
  };

  const handleActivitySelect = (activity: ActivityType) => {
    onActivitySelect(activity);
    setIsOpen(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-title">Ask Buddha </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="activities-nav-btn"
            onClick={() => toggleSidebar("activities")}
            aria-label="Activities"
            style={{
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--color-bg-elevated)",
              border: "1.5px solid rgba(160, 120, 48, 0.4)",
              borderRadius: "var(--border-radius-md)",
              cursor: "pointer",
              color: "var(--color-gold-bright)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
            }}
          >
            <FiActivity className="hamburger-icon" />
            Activities
          </button>
          <button
            className="hamburger-btn"
            onClick={() => toggleSidebar("info")}
            aria-label="Toggle menu"
          >
            <FiMenu className="hamburger-icon" />
          </button>
        </div>
      </div>

      <div
        className={`side-panel-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`side-panel ${isOpen ? "active" : ""}`}>
        <div className="side-panel-content">
          <div className="side-panel-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                className={`text-size-btn ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
                style={{ width: "80px", margin: 0 }}
              >
                Info
              </button>
              <button 
                className={`text-size-btn ${activeTab === "activities" ? "active" : ""}`}
                onClick={() => setActiveTab("activities")}
                style={{ width: "90px", margin: 0 }}
              >
                Activities
              </button>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FiX className="close-icon" />
            </button>
          </div>

          <div className="side-panel-sections" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {activeTab === "info" ? (
              <>
                {/* About Ask Buddha */}
                <div className="info-box new-theme">
                  <div className="info-header">
                    <div className="info-icon">
                      <FaInfo />
                    </div>
                    <h3 className="info-title">About Ask Buddha</h3>
                  </div>
                  <p className="info-description">{ABOUT_APP_TEXT}</p>
                </div>

                {/* Text Size */}
                <div className="text-size-container">
                  <div className="setting-label">
                    <div className="setting-icon">
                      <RxFontSize />
                    </div>
                    <span>Change Font size</span>
                  </div>
                  <div className="text-size-buttons">
                    <button
                      className={`text-size-btn ${currentTextSize === "small" ? "active" : ""}`}
                      onClick={() => handleTextSizeChange("small")}
                    >
                      Small
                    </button>
                    <button
                      className={`text-size-btn ${currentTextSize === "medium" ? "active" : ""}`}
                      onClick={() => handleTextSizeChange("medium")}
                    >
                      Medium
                    </button>
                    <button
                      className={`text-size-btn ${currentTextSize === "large" ? "active" : ""}`}
                      onClick={() => handleTextSizeChange("large")}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="activities-container" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="setting-label" style={{ marginBottom: "10px" }}>
                  <div className="setting-icon">
                    <FiActivity />
                  </div>
                  <span>Choose Activity</span>
                </div>
                
                <button
                  className={`text-size-btn ${currentActivity === "chat" ? "active" : ""}`}
                  onClick={() => handleActivitySelect("chat")}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", height: "auto", justifyContent: "flex-start" }}
                >
                  <FiMessageSquare size={18} />
                  <span>Ask Buddha (Chat)</span>
                </button>
                
                <button
                  className={`text-size-btn ${currentActivity === "mind-map" ? "active" : ""}`}
                  onClick={() => handleActivitySelect("mind-map")}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", height: "auto", justifyContent: "flex-start" }}
                >
                  <FiMap size={18} />
                  <span>Create Mind-Map</span>
                </button>
              </div>
            )}

            <div className="created-by-section" style={{ marginTop: "auto" }}>
              <div className="created-by-content">
                <p>Created by</p>
                <a
                  href="https://symbiosis.solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-link"
                >
                  <img
                    src={logo}
                    alt="Symbiosis Solutions"
                    className="company-logo"
                  />
                  <span className="company-name">Symbiosis Solutions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
