// Individual chat message component
import React, { useState } from 'react';
import { formatTimestamp, formatAgentResponse, beautifyJSON } from '../utils/messageFormatter';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { sender, content, type, timestamp, metadata } = message;
  const isAgent = sender === 'agent';
  const isError = type === 'error';

  const formattedContent = formatAgentResponse(content, type);
  const shouldTruncate = formattedContent.length > 500 && type !== 'error';

  const handleCopy = async () => {
    try {
      const textToCopy = typeof content === 'object' 
        ? JSON.stringify(content, null, 2) 
        : content;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const dataStr = beautifyJSON(content);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-message-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    let displayContent = formattedContent;
    
    if (shouldTruncate && !expanded) {
      displayContent = formattedContent.substring(0, 500) + '...';
    }

    // Check if content contains JSON code blocks
    if (displayContent.includes('```json')) {
      return <pre className="message-code">{displayContent}</pre>;
    }

    // Check if content is plain JSON
    if (displayContent.startsWith('{') || displayContent.startsWith('[')) {
      return <pre className="message-json">{displayContent}</pre>;
    }

    // Handle markdown-style formatting
    const parts = displayContent.split(/(\*\*.*?\*\*|`.*?`|```[\s\S]*?```)/g);
    return (
      <div className="message-text">
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={idx}>{part.slice(1, -1)}</code>;
          }
          if (part.startsWith('```')) {
            return <pre key={idx}>{part.slice(3, -3)}</pre>;
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className={`chat-message ${isAgent ? 'agent' : 'user'} ${isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {isAgent ? '🤖' : '👤'}
      </div>
      
      <div className="message-bubble">
        <div className="message-content">
          {renderContent()}
          
          {shouldTruncate && (
            <button 
              className="expand-btn"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {metadata?.fileName && (
          <div className="message-metadata">
            📎 {metadata.fileName}
            {metadata.fileSize && ` (${(metadata.fileSize / 1024).toFixed(1)} KB)`}
          </div>
        )}

        <div className="message-footer">
          <span className="message-time">{formatTimestamp(timestamp)}</span>
          
          <div className="message-actions">
            <button
              className="action-btn"
              onClick={handleCopy}
              title="Copy content"
            >
              {copied ? '✓' : '📋'}
            </button>
            
            {type === 'document' && (
              <button
                className="action-btn"
                onClick={handleDownload}
                title="Download as JSON"
              >
                💾
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
