import { FormEvent } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { Button } from './Button';
import './ChatInput.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClear: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onClear,
  disabled,
  inputRef,
}: ChatInputProps) => (
  <div className="input-bar">
    <form className="input-bar-form" onSubmit={onSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="What would you like to ask Buddha today?"
        aria-label="Ask Buddha a question"
      />
      <div className="input-bar-actions">
        <Button
          type="submit"
          variant="icon"
          title="Send message"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <FiSend size={20} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          title="Clear chat"
          onClick={onClear}
          className="clear-btn"
          aria-label="Clear chat"
        >
          <FiTrash2 size={16} />
        </Button>
      </div>
    </form>
  </div>
);
