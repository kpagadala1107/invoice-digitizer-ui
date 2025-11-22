// Agent information and capabilities display
import React, { useState } from 'react';
import './AgentInfo.css';

const AgentInfo = ({ agentInfo, tools, connectionStatus }) => {
  const [expanded, setExpanded] = useState(false);

  if (!agentInfo && connectionStatus !== 'connected') {
    return null;
  }

  const statusIcon = {
    connected: '🟢',
    connecting: '🟡',
    disconnected: '🔴',
  };

  return (
    <div className="agent-info-container">
      <div className="agent-info-header" onClick={() => setExpanded(!expanded)}>
        <div className="agent-status">
          <span className="status-icon">{statusIcon[connectionStatus]}</span>
          <span className="status-text">
            {connectionStatus === 'connected' ? 'Online' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 
             'Offline'}
          </span>
        </div>
        
        <button className="expand-toggle">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="agent-info-content">
          {agentInfo && (
            <div className="info-section">
              <h4>Agent Information</h4>
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{agentInfo.name || 'Doc Digitizer Agent'}</span>
              </div>
              {agentInfo.version && (
                <div className="info-item">
                  <span className="info-label">Version:</span>
                  <span className="info-value">{agentInfo.version}</span>
                </div>
              )}
              {agentInfo.description && (
                <div className="info-item">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{agentInfo.description}</span>
                </div>
              )}
            </div>
          )}

          {tools && tools.length > 0 && (
            <div className="info-section">
              <h4>Available Tools</h4>
              <ul className="tools-list">
                {tools.map((tool, idx) => (
                  <li key={idx} className="tool-item">
                    <span className="tool-icon">🔧</span>
                    <div className="tool-details">
                      <div className="tool-name">{tool.name || tool}</div>
                      {tool.description && (
                        <div className="tool-description">{tool.description}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {agentInfo?.capabilities && (
            <div className="info-section">
              <h4>Capabilities</h4>
              <ul className="capabilities-list">
                {agentInfo.capabilities.map((capability, idx) => (
                  <li key={idx}>✓ {capability}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentInfo;
