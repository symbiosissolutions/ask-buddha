import Markdown from 'react-markdown';
import lotusIcon from '../assets/lotus.png';
import userIcon from '../assets/user.png';
import { ROLE_LABELS } from '../constants/enums';
import './MessageBubble.css';

type Role = 'user' | 'assistant';

interface MessageBubbleProps {
  role: Role;
  content: string;
  format?: 'markdown' | 'text';
}

export const MessageBubble = ({ role, content, format }: MessageBubbleProps) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={`bubble bubble-${role}`}>
      <div className="bubble-header">
        <img
          src={isAssistant ? lotusIcon : userIcon}
          alt={ROLE_LABELS[role]}
          className="bubble-avatar"
        />
        <span className="bubble-author">{ROLE_LABELS[role]}</span>
      </div>
      <div className="bubble-content">
        {format === 'markdown' ? (
          <Markdown>{content}</Markdown>
        ) : (
          content
        )}
      </div>
    </div>
  );
};
