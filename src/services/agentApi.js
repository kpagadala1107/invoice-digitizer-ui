// API Service Layer for Doc Digitizer Agent
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_AGENT_API_URL || 'http://localhost:8081/api/agent';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('[API Error] No response received:', error.message);
    } else {
      // Something else happened
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

// Agent API functions
export const agentApi = {
  // Get agent information and capabilities
  getAgentInfo: async () => {
    try {
      const response = await apiClient.get('/info');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch agent info',
      };
    }
  },

  // Get available tools
  getTools: async () => {
    try {
      const response = await apiClient.get('/tools');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch tools',
      };
    }
  },

  // Send chat message
  sendMessage: async (message, context = null) => {
    try {
      const response = await apiClient.post('/chat', {
        message,
        context,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message',
      };
    }
  },

  // Process document with file upload
  processDocument: async (file, instruction = 'Extract and validate this document') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('instruction', instruction);

      const response = await apiClient.post('/process-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to process document',
      };
    }
  },

  // Validate document data
  validateDocument: async (data) => {
    try {
      const response = await apiClient.post('/validate', data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to validate document',
      };
    }
  },

  // Search database records
  searchRecords: async (query) => {
    try {
      const response = await apiClient.get('/search', {
        params: { query },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search records',
      };
    }
  },

  // Convert data format
  convertData: async (data, format) => {
    try {
      const response = await apiClient.post('/convert', {
        data,
        format,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to convert data',
      };
    }
  },
};

export default agentApi;
