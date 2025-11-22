// Tool selector component for specialized operations
import React, { useState } from 'react';
import './ToolSelector.css';

const ToolSelector = ({ tools, onToolSelect, disabled }) => {
  const [showTools, setShowTools] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const predefinedTools = [
    {
      id: 'extract',
      name: 'Extract Data',
      icon: '📄',
      description: 'Extract data from documents',
      action: 'extract',
    },
    {
      id: 'validate',
      name: 'Validate',
      icon: '✓',
      description: 'Validate document data',
      action: 'validate',
    },
    {
      id: 'search',
      name: 'Search',
      icon: '🔍',
      description: 'Search database records',
      action: 'search',
    },
    {
      id: 'convert',
      name: 'Convert',
      icon: '🔄',
      description: 'Convert data format (JSON/XML)',
      action: 'convert',
    },
    {
      id: 'compare',
      name: 'Compare',
      icon: '⚖️',
      description: 'Compare documents',
      action: 'compare',
    },
  ];

  const allTools = tools && tools.length > 0 ? tools : predefinedTools;

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    onToolSelect(tool);
    setShowTools(false);
  };

  return (
    <div className="tool-selector-container">
      <button
        className="tools-toggle-btn"
        onClick={() => setShowTools(!showTools)}
        disabled={disabled}
      >
        🔧 Tools {showTools ? '▼' : '▶'}
      </button>

      {showTools && (
        <div className="tools-panel">
          <div className="tools-header">
            <h3>Select a Tool</h3>
            <button
              className="close-panel-btn"
              onClick={() => setShowTools(false)}
            >
              ✕
            </button>
          </div>

          <div className="tools-grid">
            {allTools.map((tool) => {
              const toolId = tool.id || tool.name;
              const toolName = tool.name || tool;
              const toolIcon = tool.icon || '🔧';
              const toolDescription = tool.description || '';

              return (
                <button
                  key={toolId}
                  className={`tool-card ${selectedTool?.id === toolId ? 'selected' : ''}`}
                  onClick={() => handleToolClick(tool)}
                  disabled={disabled}
                >
                  <div className="tool-icon-large">{toolIcon}</div>
                  <div className="tool-name">{toolName}</div>
                  {toolDescription && (
                    <div className="tool-description">{toolDescription}</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="tools-footer">
            <p>Select a tool to perform specialized operations</p>
          </div>
        </div>
      )}

      {selectedTool && !showTools && (
        <div className="selected-tool-badge">
          <span>{selectedTool.icon || '🔧'}</span>
          <span>{selectedTool.name}</span>
          <button
            className="clear-selection-btn"
            onClick={() => setSelectedTool(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolSelector;
