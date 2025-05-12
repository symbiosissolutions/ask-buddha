import { useState, useEffect } from "react";

import "../navbar.css";

import { ABOUT_APP_TEXT } from "../constants/content";

import { FiMenu, FiX } from "react-icons/fi";
import { FaInfo } from "react-icons/fa";
import { RxFontSize } from "react-icons/rx";

import logo from "../assets/logo.png";

type TextSizeOption = "small" | "medium" | "large";

interface NavbarProps {
  onTextSizeChange: (size: TextSizeOption) => void;
  currentTextSize: TextSizeOption;
}

const Navbar = ({
  onTextSizeChange,
  currentTextSize = "medium",
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".side-panel") &&
        !target.closest(".hamburger-btn") &&
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleTextSizeChange = (size: TextSizeOption) => {
    onTextSizeChange(size);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-title">Ask Buddha </div>
        <button
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu className="hamburger-icon" />
        </button>
      </div>

      <div
        className={`side-panel-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      <div className={`side-panel ${isOpen ? "active" : ""}`}>
        <div className="side-panel-content">
          <div className="side-panel-header">
            <button className="close-btn" onClick={toggleSidebar}>
              <FiX className="close-icon" />
            </button>
          </div>

          <div className="side-panel-sections">
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

            <div className="created-by-section">
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
