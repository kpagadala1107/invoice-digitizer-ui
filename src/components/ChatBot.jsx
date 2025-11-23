// Main ChatBot component
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AgentInfo from './AgentInfo';
import ToolSelector from './ToolSelector';
import './ChatBot.css';

const ChatBot = () => {
  const {
    messages,
    loading,
    agentInfo,
    tools,
    connectionStatus,
    sendMessage,
    uploadDocument,
    clearChat,
    retryLastMessage,
    messagesEndRef,
  } = useChat();

  const [selectedTool, setSelectedTool] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSendMessage = async (input) => {
    let messageToSend = input;
    
    // Prepend tool context if a tool is selected
    if (selectedTool) {
      messageToSend = `[Using ${selectedTool.name}] ${input}`;
    }
    
    await sendMessage(messageToSend);
  };

  const handleFileUpload = async (file, instruction) => {
    await uploadDocument(file, instruction);
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearChat();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`chatbot-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-left">
            <div className="agent-avatar">🤖</div>
            <div className="header-info">
              <h2>Doc Digitizer Agent</h2>
              <AgentInfo
                agentInfo={agentInfo}
                tools={tools}
                connectionStatus={connectionStatus}
              />
            </div>
          </div>

          <div className="header-actions">
            <ToolSelector
              tools={tools}
              onToolSelect={handleToolSelect}
              disabled={loading}
            />
            
            <button
              className="header-btn"
              onClick={toggleDarkMode}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button
              className="header-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙️
            </button>

            <button
              className="header-btn"
              onClick={handleClearChat}
              title="Clear chat"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-content">
              <h3>Settings</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  Dark Mode
                </label>
              </div>
              <div className="setting-item">
                <label>API Endpoint:</label>
                <input
                  type="text"
                  // value="http://localhost:8081/api/agent"
                  value="https://invoice-digitizer-service-production.up.railway.app/api/agent"
                  readOnly
                  className="endpoint-input"
                />
              </div>
              <button
                className="close-settings-btn"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Welcome to Doc Digitizer</h3>
              <p>Start a conversation or upload a document to begin</p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {loading && (
            <div className="chat-message agent loading">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Connection Error Banner */}
        {connectionStatus === 'disconnected' && (
          <div className="connection-error-banner">
            <span>⚠️ Unable to connect to agent. Please check if the backend is running.</span>
            <button onClick={retryLastMessage}>Retry</button>
          </div>
        )}

        {/* Input Container */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          disabled={loading || connectionStatus === 'disconnected'}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ChatBot;
