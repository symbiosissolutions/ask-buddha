import './TypingIndicator.css';
import lotusIcon from '../assets/lotus.png';
import { ROLE_LABELS } from '../constants/enums';

export const TypingIndicator = () => (
  <div className="typing-bubble" aria-label="Buddha is thinking">
    <div className="typing-header">
      <img src={lotusIcon} alt={ROLE_LABELS.assistant} className="typing-avatar" />
      <span className="typing-author">{ROLE_LABELS.assistant}</span>
    </div>
    <div className="typing-dots">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  </div>
);
