// Chat input component with file upload support
import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, onFileUpload, disabled, loading }) => {
  const [input, setInput] = useState('');
  const [instruction, setInstruction] = useState('Extract and validate this document');
  const [showInstructionInput, setShowInstructionInput] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file, instruction);
      e.target.value = ''; // Reset file input
      setShowInstructionInput(false);
    }
  };

  const handleUploadClick = () => {
    if (showInstructionInput) {
      fileInputRef.current?.click();
    } else {
      setShowInstructionInput(true);
    }
  };

  const quickActions = [
    { label: 'What can you do?', value: 'What can you help me with?' },
    { label: 'Extract invoice', value: 'Extract data from this invoice' },
    { label: 'Validate data', value: 'Validate this document data' },
    { label: 'Search records', value: 'Search for vendor records' },
  ];

  const handleQuickAction = (value) => {
    setInput(value);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-input-container">
      {showInstructionInput && (
        <div className="instruction-input">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Enter instruction for document processing..."
            className="instruction-field"
          />
          <button
            type="button"
            onClick={() => setShowInstructionInput(false)}
            className="close-instruction-btn"
          >
            ✕
          </button>
        </div>
      )}

      <div className="quick-actions">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            className="quick-action-btn"
            onClick={() => handleQuickAction(action.value)}
            disabled={disabled}
          >
            {action.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
          style={{ display: 'none' }}
        />

        <button
          type="button"
          className="upload-btn"
          onClick={handleUploadClick}
          disabled={disabled}
          title="Upload document"
        >
          📎
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={disabled}
          rows={1}
          className="message-input"
        />

        <button
          type="submit"
          className="send-btn"
          disabled={disabled || !input.trim()}
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </form>

      <div className="input-hint">
        Press Enter to send • Shift+Enter for new line • Click 📎 to upload files
      </div>
    </div>
  );
};

export default ChatInput;
