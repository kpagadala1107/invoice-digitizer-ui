# React ChatBot Integration - Doc Digitizer Agent

A modern, feature-rich React chatbot application that seamlessly integrates with the Doc Digitizer Agent backend.

## 🚀 Features

### Core Functionality
- **💬 Interactive Chat Interface** - Modern, responsive UI with message bubbles for user and agent
- **📄 Document Processing** - Upload PDFs and images for intelligent data extraction
- **🔧 Tool Selection** - Visual tool selector for specialized operations (extract, validate, search, convert)
- **⚡ Real-time Responses** - Live typing indicators and smooth message animations
- **📜 Conversation History** - Maintains context throughout the session
- **🎨 Dark Mode** - Toggle between light and dark themes
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- **Quick Actions** - Pre-defined prompts for common tasks
- **File Upload with Instructions** - Specify custom processing instructions for documents
- **Message Actions** - Copy content, download JSON responses
- **Connection Status** - Real-time backend connectivity monitoring
- **Agent Information Panel** - View agent capabilities and available tools
- **Error Handling** - Graceful error messages and retry functionality
- **Markdown Support** - Rich text formatting in messages
- **Code Block Display** - Syntax highlighting for JSON/XML responses

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatBot.jsx              # Main chatbot container
│   ├── ChatBot.css              # Chatbot styling
│   ├── ChatMessage.jsx          # Individual message component
│   ├── ChatMessage.css          # Message styling
│   ├── ChatInput.jsx            # Input field with file upload
│   ├── ChatInput.css            # Input styling
│   ├── AgentInfo.jsx            # Agent capabilities display
│   ├── AgentInfo.css            # Agent info styling
│   ├── ToolSelector.jsx         # Tool selection component
│   └── ToolSelector.css         # Tool selector styling
├── services/
│   └── agentApi.js              # API service layer
├── hooks/
│   └── useChat.js               # Custom chat state management hook
├── utils/
│   └── messageFormatter.js      # Message formatting utilities
└── pages/
    └── ChatBotPage.js           # ChatBot page wrapper
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Doc Digitizer Agent backend running at `http://localhost:8081`

### Setup

1. **Install Dependencies**
```bash
npm install
# or
yarn install
```

2. **Configure API Endpoint** (Optional)

Create a `.env` file in the root directory:
```env
REACT_APP_AGENT_API_URL=http://localhost:8081/api/agent
```

3. **Start the Development Server**
```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

4. **Access the ChatBot**

Navigate to `/chatbot` route or click the "AI Agent" button in the header.

## 🔌 Backend Integration

### API Endpoints

The chatbot integrates with the following backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agent/info` | GET | Get agent information and capabilities |
| `/api/agent/tools` | GET | List available tools |
| `/api/agent/chat` | POST | Send text messages |
| `/api/agent/process-document` | POST | Upload and process documents |
| `/api/agent/validate` | POST | Validate document data |
| `/api/agent/search` | GET | Search database records |
| `/api/agent/convert` | POST | Convert data format |

### Request/Response Examples

#### Chat Message
**Request:**
```json
POST /api/agent/chat
{
  "message": "What can you help me with?",
  "context": null
}
```

**Response:**
```json
{
  "response": "I can help you extract data from documents, validate information, search records, and convert data formats.",
  "context": {...}
}
```

#### Document Processing
**Request:**
```
POST /api/agent/process-document
Content-Type: multipart/form-data

file: [binary data]
instruction: "Extract and validate this invoice"
```

**Response:**
```json
{
  "extractedData": {...},
  "validation": {...},
  "message": "Document processed successfully"
}
```

## 💡 Usage Examples

### Basic Chat Interaction
1. Type a question in the input field
2. Press Enter or click the send button
3. View the agent's response

### Document Upload
1. Click the 📎 (paperclip) icon
2. Optionally modify the processing instruction
3. Select a file (PDF, JPG, PNG)
4. Wait for extraction results

### Using Tools
1. Click the "🔧 Tools" button
2. Select a specific tool (Extract, Validate, Search, etc.)
3. The selected tool will be used for subsequent messages

### Sample Queries
- "What can you help me with?"
- "Extract data from this invoice" (with file upload)
- "Validate this document data"
- "Search for vendor Acme Corp"
- "Convert this data to JSON format"

## 🎨 Customization

### Styling

All components have separate CSS files for easy customization:

- `ChatBot.css` - Main container and layout
- `ChatMessage.css` - Message bubbles and formatting
- `ChatInput.css` - Input field and quick actions
- `AgentInfo.css` - Agent information panel
- `ToolSelector.css` - Tool selection interface

### Theme Colors

Edit the CSS files to change the color scheme:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### API Configuration

Modify `src/services/agentApi.js` to change API behavior:

```javascript
const API_BASE_URL = process.env.REACT_APP_AGENT_API_URL || 'http://localhost:8081/api/agent';
```

## 🔧 Advanced Configuration

### Custom Message Formatters

Edit `src/utils/messageFormatter.js` to customize how messages are displayed:

```javascript
export const formatAgentResponse = (content, type = 'text') => {
  // Add custom formatting logic
};
```

### Adding New Tools

Update `src/components/ToolSelector.jsx`:

```javascript
const predefinedTools = [
  {
    id: 'my-tool',
    name: 'My Custom Tool',
    icon: '🎯',
    description: 'Custom tool description',
    action: 'my-action',
  },
  // ... other tools
];
```

### Custom Hooks

The `useChat` hook can be extended with additional functionality:

```javascript
// src/hooks/useChat.js
export const useChat = () => {
  // Add custom state and functions
  const [customState, setCustomState] = useState(null);
  
  const customFunction = async () => {
    // Custom logic
  };
  
  return {
    // ... existing returns
    customState,
    customFunction,
  };
};
```

## 🐛 Troubleshooting

### Connection Issues

**Problem:** "Unable to connect to agent" error

**Solutions:**
1. Ensure backend is running at `http://localhost:8081`
2. Check CORS settings on backend
3. Verify API endpoint in `.env` file
4. Check browser console for network errors

### File Upload Fails

**Problem:** Document upload returns error

**Solutions:**
1. Check file size limits (default usually 10MB)
2. Verify file format is supported (PDF, JPG, PNG)
3. Ensure backend has file upload configured
4. Check browser console for specific error messages

### Messages Not Displaying

**Problem:** Chat messages don't appear

**Solutions:**
1. Check React DevTools for component errors
2. Verify API responses in Network tab
3. Check `useChat` hook state in React DevTools
4. Ensure message formatting is working correctly

## 📱 Mobile Optimization

The chatbot is fully responsive and optimized for mobile devices:

- Touch-friendly buttons and input
- Adaptive layout for small screens
- Swipe gestures support
- Mobile-optimized quick actions
- Responsive tool selector

## 🔐 Security Considerations

- All API calls use axios interceptors for consistency
- File uploads validate MIME types
- XSS protection through React's built-in escaping
- Sensitive data is not logged to console in production
- Consider adding authentication for production use

## 📊 Performance

- Lazy loading of message history
- Optimized re-renders with React.memo
- Debounced API calls where appropriate
- Efficient state management with custom hooks
- CSS animations use GPU acceleration

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Environment Variables

Set the following for production:

```env
REACT_APP_AGENT_API_URL=https://your-production-api.com/api/agent
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of the Invoice Digitizer UI application.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section above
- Review backend API documentation
- Check browser console for errors
- Verify all dependencies are installed

## 🎯 Future Enhancements

- [ ] Voice input support
- [ ] Multi-language support
- [ ] Message search functionality
- [ ] Export conversation history
- [ ] Drag-and-drop file upload
- [ ] Real-time collaboration
- [ ] Webhook notifications
- [ ] Custom emoji reactions
- [ ] Message editing
- [ ] Conversation branching

## 📞 Contact

For more information about the Doc Digitizer Agent backend, refer to the backend repository documentation.

---

Built with ❤️ using React, Axios, and modern web technologies.
