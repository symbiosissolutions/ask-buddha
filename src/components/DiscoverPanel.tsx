import React, { useState } from 'react';
import { ACTIVITIES, ActivityType } from '../constants/activities';
import './DiscoverPanel.css';

interface DiscoverPanelProps {
  currentActivity: ActivityType;
  onActivitySelect: (activity: ActivityType) => void;
  isOpen: boolean;
}

const ActivityCard: React.FC<{
  activity: typeof ACTIVITIES[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ activity, isActive, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`activity-card ${isActive ? 'active' : ''} span-${activity.span}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {!imageError ? (
        <img 
          src={activity.imagePath} 
          alt={activity.altText} 
          onError={() => setImageError(true)}
          className="activity-card-image"
        />
      ) : (
        <div className="activity-card-fallback">
          <span>{activity.altText}</span>
        </div>
      )}
      <div className="activity-card-overlay">
        <h3 className="activity-card-label">{activity.label}</h3>
      </div>
    </div>
  );
};

const DiscoverPanel: React.FC<DiscoverPanelProps> = ({ currentActivity, onActivitySelect, isOpen }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <aside className={`discover-panel ${isOpen ? 'open' : 'closed'}`}>
      <header className="discover-header">
        <h1 className="discover-greeting">{getGreeting()}, friend! </h1>
      </header>
      <div className="discover-grid">
        {ACTIVITIES.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isActive={currentActivity === activity.id}
            onClick={() => onActivitySelect(activity.id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default DiscoverPanel;
