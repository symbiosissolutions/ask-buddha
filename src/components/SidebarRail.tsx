import React from 'react';
import { FiEdit, FiGrid, FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './SidebarRail.css';
import lotusImg from '../assets/lotus.png';

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
      <div className="rail-top">
        <button
          className="rail-logo"
          onClick={onToggleCollapsed}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <img src={lotusImg} alt="Lotus" className="rail-logo-img" />
        </button>
      </div>
      
      <div className="rail-middle">
        <button 
          className="rail-item" 
          onClick={onNewChatClick}
          title="New Chat"
          aria-label="New Chat"
        >
          <FiEdit size={20} />
          <span className="rail-label">New Chat</span>
        </button>
        
        <button 
          className={`rail-item ${isDiscoverOpen ? 'active' : ''}`} 
          onClick={onToggleDiscover}
          title="Discover Activities"
          aria-label="Discover Activities"
        >
          <FiGrid size={20} />
          <span className="rail-label">Discover</span>
        </button>
        
        <button 
          className="rail-item" 
          onClick={onHomeClick}
          title="Home"
          aria-label="Home"
        >
          <FiHome size={20} />
          <span className="rail-label">Home</span>
        </button>
      </div>
      
      <div className="rail-bottom">
        <button
          className="rail-collapse-btn"
          onClick={onToggleCollapsed}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>
    </nav>
  );
};

export default SidebarRail;
