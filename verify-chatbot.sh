#!/bin/bash

# React ChatBot - Installation Verification Script
# Run this script to verify your chatbot installation

echo "🤖 React ChatBot - Installation Verification"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 - MISSING"
        ((FAILED++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 - MISSING"
        ((FAILED++))
    fi
}

echo "📦 Checking Core Components..."
check_file "src/components/ChatBot.jsx" "ChatBot.jsx"
check_file "src/components/ChatMessage.jsx" "ChatMessage.jsx"
check_file "src/components/ChatInput.jsx" "ChatInput.jsx"
check_file "src/components/AgentInfo.jsx" "AgentInfo.jsx"
check_file "src/components/ToolSelector.jsx" "ToolSelector.jsx"
echo ""

echo "🎨 Checking Stylesheets..."
check_file "src/components/ChatBot.css" "ChatBot.css"
check_file "src/components/ChatMessage.css" "ChatMessage.css"
check_file "src/components/ChatInput.css" "ChatInput.css"
check_file "src/components/AgentInfo.css" "AgentInfo.css"
check_file "src/components/ToolSelector.css" "ToolSelector.css"
echo ""

echo "🔧 Checking Services & Utilities..."
check_file "src/services/agentApi.js" "agentApi.js"
check_file "src/hooks/useChat.js" "useChat.js"
check_file "src/utils/messageFormatter.js" "messageFormatter.js"
check_file "src/pages/ChatBotPage.js" "ChatBotPage.js"
echo ""

echo "📚 Checking Documentation..."
check_file "CHATBOT_README.md" "CHATBOT_README.md"
check_file "CHATBOT_QUICKSTART.md" "CHATBOT_QUICKSTART.md"
check_file "BACKEND_INTEGRATION.md" "BACKEND_INTEGRATION.md"
check_file "IMPLEMENTATION_SUMMARY.md" "IMPLEMENTATION_SUMMARY.md"
check_file "VISUAL_GUIDE.md" "VISUAL_GUIDE.md"
echo ""

echo "🧪 Checking Tests..."
check_file "src/components/ChatBot.test.js" "ChatBot.test.js"
echo ""

echo "⚙️ Checking Configuration..."
check_file ".env.example" ".env.example"
check_file "package.json" "package.json"
echo ""

echo "📁 Checking Directories..."
check_dir "src/components" "components/"
check_dir "src/services" "services/"
check_dir "src/hooks" "hooks/"
check_dir "src/utils" "utils/"
check_dir "src/pages" "pages/"
echo ""

echo "🔍 Checking Dependencies..."
if npm list axios >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} axios installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} axios not installed"
    ((FAILED++))
fi

if npm list react >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} react installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} react not installed"
    ((FAILED++))
fi

if npm list react-router-dom >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} react-router-dom installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} react-router-dom not installed"
    ((FAILED++))
fi
echo ""

echo "🔌 Checking Backend Connection..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/api/agent/info 2>/dev/null | grep -q "200\|404\|500"; then
    echo -e "${GREEN}✓${NC} Backend is reachable at http://localhost:8081"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Backend not running (http://localhost:8081)"
    echo "  Note: This is optional for development, but required for full functionality"
fi
echo ""

echo "=============================================="
echo "📊 Results:"
echo -e "   ${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "   ${RED}Failed: $FAILED${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your chatbot is ready to use!${NC}"
    echo ""
    echo "🚀 Quick Start:"
    echo "   1. Start the app: npm start"
    echo "   2. Navigate to: http://localhost:3000/chatbot"
    echo "   3. Start chatting! 💬"
    echo ""
    echo "📚 For detailed documentation, see:"
    echo "   - CHATBOT_QUICKSTART.md (5-minute guide)"
    echo "   - CHATBOT_README.md (complete documentation)"
    echo "   - VISUAL_GUIDE.md (quick reference)"
else
    echo -e "${RED}⚠️  Some checks failed. Please review the missing items above.${NC}"
    echo ""
    echo "🔧 Common fixes:"
    echo "   - Run: npm install"
    echo "   - Ensure all files were created successfully"
    echo "   - Check the IMPLEMENTATION_SUMMARY.md for file list"
fi

echo ""
