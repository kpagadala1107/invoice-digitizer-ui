// Test file for ChatBot components
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatBot from '../components/ChatBot';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { agentApi } from '../services/agentApi';

// Mock the API
jest.mock('../services/agentApi');

describe('ChatBot Component', () => {
  beforeEach(() => {
    // Mock successful API responses
    agentApi.getAgentInfo = jest.fn().mockResolvedValue({
      success: true,
      data: {
        name: 'Doc Digitizer Agent',
        version: '1.0.0',
        description: 'Document processing agent',
      },
    });

    agentApi.getTools = jest.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 'extract', name: 'Extract Data', icon: '📄' },
        { id: 'validate', name: 'Validate', icon: '✓' },
      ],
    });

    agentApi.sendMessage = jest.fn().mockResolvedValue({
      success: true,
      data: {
        response: 'Hello! How can I help you?',
      },
    });
  });

  test('renders chatbot container', () => {
    render(
      <BrowserRouter>
        <ChatBot />
      </BrowserRouter>
    );
    expect(screen.getByText('Doc Digitizer Agent')).toBeInTheDocument();
  });

  test('displays welcome message on mount', async () => {
    render(
      <BrowserRouter>
        <ChatBot />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello! I'm Doc Digitizer/i)).toBeInTheDocument();
    });
  });
});

describe('ChatMessage Component', () => {
  test('renders user message', () => {
    const message = {
      id: 1,
      sender: 'user',
      content: 'Test message',
      type: 'text',
      timestamp: new Date(),
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('renders agent message', () => {
    const message = {
      id: 2,
      sender: 'agent',
      content: 'Agent response',
      type: 'text',
      timestamp: new Date(),
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText('Agent response')).toBeInTheDocument();
  });

  test('displays copy button on hover', () => {
    const message = {
      id: 3,
      sender: 'agent',
      content: 'Copy me',
      type: 'text',
      timestamp: new Date(),
    };

    render(<ChatMessage message={message} />);
    const messageElement = screen.getByText('Copy me').closest('.chat-message');
    
    // The copy button should exist
    const copyButton = messageElement.querySelector('.action-btn');
    expect(copyButton).toBeInTheDocument();
  });
});

describe('ChatInput Component', () => {
  test('renders input field', () => {
    const mockSend = jest.fn();
    const mockUpload = jest.fn();

    render(
      <ChatInput
        onSendMessage={mockSend}
        onFileUpload={mockUpload}
        disabled={false}
        loading={false}
      />
    );

    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
  });

  test('calls onSendMessage when send button clicked', async () => {
    const mockSend = jest.fn();
    const mockUpload = jest.fn();

    render(
      <ChatInput
        onSendMessage={mockSend}
        onFileUpload={mockUpload}
        disabled={false}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole('button', { name: /🚀/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith('Hello');
    });
  });

  test('renders quick action buttons', () => {
    const mockSend = jest.fn();
    const mockUpload = jest.fn();

    render(
      <ChatInput
        onSendMessage={mockSend}
        onFileUpload={mockUpload}
        disabled={false}
        loading={false}
      />
    );

    expect(screen.getByText('What can you do?')).toBeInTheDocument();
    expect(screen.getByText('Extract invoice')).toBeInTheDocument();
  });
});

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAgentInfo returns success', async () => {
    const mockData = { name: 'Test Agent' };
    agentApi.getAgentInfo = jest.fn().mockResolvedValue({
      success: true,
      data: mockData,
    });

    const result = await agentApi.getAgentInfo();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockData);
  });

  test('sendMessage handles errors gracefully', async () => {
    agentApi.sendMessage = jest.fn().mockResolvedValue({
      success: false,
      error: 'Connection failed',
    });

    const result = await agentApi.sendMessage('test');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Connection failed');
  });
});
