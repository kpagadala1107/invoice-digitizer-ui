// Custom hook for chat state management
import { useState, useEffect, useRef, useCallback } from 'react';
import { agentApi } from '../services/agentApi';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [tools, setTools] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [context, setContext] = useState(null);
  const messagesEndRef = useRef(null);
  const [lastDocumentJson, setLastDocumentJson] = useState(null);
  const [contextMap, setContextMap] = useState({ lastDocumentJson: null, sessionMessages: [] });



  // Initialize chat
  useEffect(() => {
    initializeChat();
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setConnectionStatus('connecting');
    
    // Fetch agent info and tools
    const [infoResult, toolsResult] = await Promise.all([
      agentApi.getAgentInfo(),
      agentApi.getTools(),
    ]);

    if (infoResult.success) {
      setAgentInfo(infoResult.data);
      setConnectionStatus('connected');
      
      // Add welcome message
      addMessage(
        'agent',
        `Hello! I'm Doc Digitizer Agent. I can help you extract, validate, and convert document data. What can I do for you today?`,
        'welcome'
      );
    } else {
      setConnectionStatus('disconnected');
      addMessage(
        'agent',
        'Unable to connect to the agent. Please check if the backend server is running at http://localhost:8081',
        'error'
      );
    }

    if (toolsResult.success) {
      setTools(toolsResult.data);
    }
  };

  const addMessage = useCallback((sender, content, type = 'text', metadata = {}) => {
    const message = {
      id: Date.now() + Math.random(),
      sender,
      content,
      type,
      metadata,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    // Update contextMap with new sessionMessages
    setContextMap(prev => ({
      ...prev,
      sessionMessages: [...(prev.sessionMessages || []), message]
    }));
    return message;
  }, []);


  const sendMessage = async (input) => {
    if (!input.trim()) return;
    addMessage('user', input);
    setLoading(true);

    try {
      // Pass contextMap as context
      const result = await agentApi.sendMessage(input, contextMap);

      if (result.success) {
        const response = result.data.response || result.data.message || 'No response received';
        addMessage('agent', response, 'text', result.data);

        if (result.data.context) {
          setContext(result.data.context);
        }
      } else {
        addMessage('agent', `Error: ${result.error}`, 'error');
      }
    } catch (error) {
      addMessage('agent', 'Sorry, I encountered an unexpected error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file, instruction) => {
    if (!file) return;

    addMessage('user', `📎 Uploaded: ${file.name}`, 'file', { fileName: file.name, fileSize: file.size });
    setLoading(true);

    try {
      const result = await agentApi.processDocument(file, instruction);

      if (result.success) {
        setLastDocumentJson(result.data.response);
               setContextMap(prev => ({
          ...prev,
          lastDocumentJson: parsedResponse
        }));
        const parsedResponse = JSON.parse(result.data.response);
        const prettyResponse = JSON.stringify(parsedResponse, null, 2);
        addMessage('agent', prettyResponse, 'document', { fileName: file.name });
      } else {
        addMessage('agent', `Failed to process document: ${result.error}`, 'error');
      }
    } catch (error) {
      addMessage('agent', 'Failed to process document. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateData = async (data) => {
    addMessage('user', 'Validating document data...', 'action');
    setLoading(true);

    try {
      const result = await agentApi.validateDocument(data);
      
      if (result.success) {
        addMessage('agent', result.data, 'validation');
      } else {
        addMessage('agent', `Validation failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addMessage('agent', 'Failed to validate document. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchRecords = async (query) => {
    addMessage('user', `Searching for: "${query}"`, 'action');
    setLoading(true);

    try {
      const result = await agentApi.searchRecords(query);
      
      if (result.success) {
        addMessage('agent', result.data, 'search');
      } else {
        addMessage('agent', `Search failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addMessage('agent', 'Failed to search records. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // clearChat is defined later (keeps contextMap reset as well)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const retryLastMessage = async () => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (lastUserMessage && lastUserMessage.type === 'text') {
      await sendMessage(lastUserMessage.content);
    }
  };

const clearChat = () => {
    setMessages([]);
    setContext(null);
    setContextMap({ lastDocumentJson: null, sessionMessages: [] });
    addMessage(
      'agent',
      'Chat history cleared. How can I help you?',
      'welcome'
    );
  };

  return {
    messages,
    loading,
    agentInfo,
    tools,
    connectionStatus,
    sendMessage,
    uploadDocument,
    validateData,
    searchRecords,
    clearChat,
    retryLastMessage,
    messagesEndRef,
  };
};

export default useChat;
