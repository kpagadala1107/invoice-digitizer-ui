# 🚀 Quick Start Guide - React ChatBot

Get up and running with the Doc Digitizer ChatBot in 5 minutes!

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] Doc Digitizer Agent backend running at `http://localhost:8081`
- [ ] Project dependencies installed

## Step 1: Install Dependencies

```bash
cd /Users/kiranpagadala/IdeaProjects/invoice-digitizer-ui
npm install
```

## Step 2: Configure Environment (Optional)

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different port:
```env
REACT_APP_AGENT_API_URL=http://localhost:YOUR_PORT/api/agent
```

## Step 3: Start the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

## Step 4: Access the ChatBot

Two ways to access the chatbot:

### Option 1: Click the "AI Agent" Button
- Look for the 🤖 AI Agent button in the header
- Click it to navigate to the chatbot

### Option 2: Direct URL
- Navigate to `http://localhost:3000/chatbot`

## Step 5: Test the ChatBot

### Test 1: Basic Chat
1. Type: "What can you help me with?"
2. Press Enter
3. You should see the agent's response

### Test 2: Document Upload
1. Click the 📎 (paperclip) icon
2. Select a PDF or image file
3. Wait for the extraction results

### Test 3: Tool Selection
1. Click the "🔧 Tools" button
2. Select "Extract Data"
3. Type a message or upload a file

## Common Issues & Quick Fixes

### ❌ "Unable to connect to agent"
**Fix:** Ensure backend is running
```bash
# In your backend terminal, you should see:
# Server running on http://localhost:8081
```

### ❌ "Module not found" errors
**Fix:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port 3000 already in use
**Fix:** Use a different port
```bash
PORT=3001 npm start
```

### ❌ CORS errors in browser console
**Fix:** Configure backend CORS to allow `http://localhost:3000`

## File Structure Overview

```
📁 Your new chatbot files:

Components:
✅ src/components/ChatBot.jsx          - Main container
✅ src/components/ChatMessage.jsx      - Message display
✅ src/components/ChatInput.jsx        - Input & upload
✅ src/components/AgentInfo.jsx        - Agent info panel
✅ src/components/ToolSelector.jsx     - Tool selection

Services:
✅ src/services/agentApi.js            - API calls

Hooks:
✅ src/hooks/useChat.js                - Chat state management

Utils:
✅ src/utils/messageFormatter.js       - Message formatting

Pages:
✅ src/pages/ChatBotPage.js            - Page wrapper

Styles:
✅ src/components/ChatBot.css
✅ src/components/ChatMessage.css
✅ src/components/ChatInput.css
✅ src/components/AgentInfo.css
✅ src/components/ToolSelector.css
```

## Features to Try

### 1. Quick Actions
Click any of the pre-defined prompts:
- "What can you do?"
- "Extract invoice"
- "Validate data"
- "Search records"

### 2. Dark Mode
Click the 🌙 icon in the header to toggle dark mode

### 3. Agent Information
Click the status indicator to see:
- Agent capabilities
- Available tools
- Connection status

### 4. Message Actions
Hover over any message to:
- 📋 Copy content
- 💾 Download as JSON

### 5. Clear Chat
Click the 🗑️ icon to clear conversation history

## Sample Conversations

### Example 1: Get Help
```
You: What can you help me with?
Agent: I can help you extract data from documents, validate information, 
       search records, and convert data formats. Would you like to know more 
       about any specific capability?
```

### Example 2: Document Processing
```
You: [uploads invoice.pdf]
Agent: Document processed successfully!
       **Extracted Data:**
       {
         "invoiceNumber": "INV-12345",
         "vendor": "Acme Corp",
         "amount": "$1,250.00"
       }
```

### Example 3: Search Records
```
You: Search for vendor Acme Corp
Agent: Found 5 result(s):
       1. Invoice #12345 - $1,250.00
       2. Invoice #12346 - $2,100.00
       ...
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Clear input |

## Next Steps

1. ✅ Try uploading different document types
2. ✅ Experiment with different tools
3. ✅ Test error handling (disconnect backend)
4. ✅ Check mobile responsiveness
5. ✅ Customize styling to match your brand

## Getting Help

### Debug Mode
Open browser DevTools (F12) to see:
- Network requests in the Network tab
- Console logs for API calls
- React component state in React DevTools

### Check Backend Logs
Monitor your backend terminal for:
- Incoming requests
- Processing status
- Error messages

### Test API Directly
Use curl or Postman to test endpoints:
```bash
curl http://localhost:8081/api/agent/info
```

## Production Checklist

Before deploying to production:

- [ ] Set production API URL in `.env`
- [ ] Build optimized bundle: `npm run build`
- [ ] Test all features in production mode
- [ ] Configure CORS on production backend
- [ ] Add authentication if needed
- [ ] Monitor performance and errors
- [ ] Set up logging and analytics

## Success! 🎉

You now have a fully functional AI-powered chatbot integrated with your Doc Digitizer Agent!

For detailed documentation, see `CHATBOT_README.md`

---

**Need help?** Check the troubleshooting section in the main README.
