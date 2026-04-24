import React from 'react';
import { FiEdit, FiGrid, FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './SidebarRail.css';

interface SidebarRailProps {
  isDiscoverOpen: boolean;
  onToggleDiscover: () => void;
  onHomeClick: () => void;
  onNewChatClick: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

const SidebarRail: React.FC<SidebarRailProps> = ({ 
  isDiscoverOpen, 
  onToggleDiscover, 
  onHomeClick, 
  onNewChatClick,
  isCollapsed,
  onToggleCollapsed
}) => {
  return (
    <nav className={`sidebar-rail ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="rail-middle">
        <button 
          className="rail-item" 
          onClick={onNewChatClick}
          title={isCollapsed ? "New Chat" : ""}
          aria-label="New Chat"
        >
          <FiEdit size={20} />
          <span className="rail-label">New Chat</span>
          {isCollapsed && <span className="rail-hover-label">New Chat</span>}
        </button>
        
        <button 
          className={`rail-item ${isDiscoverOpen ? 'active' : ''}`} 
          onClick={onToggleDiscover}
          title={isCollapsed ? "Discover Activities" : ""}
          aria-label="Discover Activities"
        >
          <FiGrid size={20} />
          <span className="rail-label">Discover</span>
          {isCollapsed && <span className="rail-hover-label">Discover</span>}
        </button>
        
        <button 
          className="rail-item" 
          onClick={onHomeClick}
          title={isCollapsed ? "Home" : ""}
          aria-label="Home"
        >
          <FiHome size={20} />
          <span className="rail-label">Home</span>
          {isCollapsed && <span className="rail-hover-label">Home</span>}
        </button>
      </div>

      <div className="rail-bottom">
        <button 
          className="rail-close-btn" 
          onClick={onToggleCollapsed}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default SidebarRail;
