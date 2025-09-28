import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Copy, Bookmark, AlertCircle, Trash2, RotateCcw, MessageSquare, History, X } from 'lucide-react';
import { askHomework, isMockMode } from '../lib/ai';
import { storage } from '../lib/storage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ChatLogsList } from '../components/chat/ChatLogsList';
import { ChatMessage, ChatLog } from '../types';

export default function Ask() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [currentChatLog, setCurrentChatLog] = useState<ChatLog | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const courses = storage.getCourses();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = storage.getChatMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      storage.setChatMessages(messages);
    }
  }, [messages]);

  const saveCurrentChat = () => {
    if (messages.length === 0) return;

    const firstMessage = messages[0];
    const title = firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
    
    const chatLog: ChatLog = {
      id: currentChatLog?.id || Date.now().toString(),
      title,
      messages,
      createdAt: currentChatLog?.createdAt || Date.now(),
      updatedAt: Date.now(),
      courseId: selectedCourse || undefined
    };

    if (currentChatLog) {
      storage.updateChatLog(currentChatLog.id, chatLog);
    } else {
      storage.addChatLog(chatLog);
    }
    
    setCurrentChatLog(chatLog);
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      saveCurrentChat();
    }
    
    setMessages([]);
    setCurrentChatLog(null);
    setSelectedCourse('');
    setInput('');
  };

  const loadChatLog = (log: ChatLog) => {
    setMessages(log.messages);
    setCurrentChatLog(log);
    setSelectedCourse(log.courseId || '');
    setShowChatHistory(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      courseId: selectedCourse || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await askHomework({
        courseId: selectedCourse || undefined,
        question: currentInput
      });

      // Simulate typing effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        courseId: selectedCourse || undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    if (messages.length > 0) {
      saveCurrentChat();
    }
    setMessages([]);
    setCurrentChatLog(null);
    setSelectedCourse('');
    storage.setChatMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const saveAsPointer = (content: string) => {
    const pointer = {
      id: Date.now().toString(),
      courseId: selectedCourse || undefined,
      title: 'AI Generated Pointer',
      body: content,
      tags: ['ai-generated', 'homework-help'],
      upvotes: 0,
      createdAt: Date.now()
    };

    storage.addPointer(pointer);
    // You could show a toast notification here
    console.log('Saved as pointer:', pointer);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
      >
        <div className={`flex items-start space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-primary-500 text-white' : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
          }`}>
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
          
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser 
              ? 'bg-primary-500 text-white' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium opacity-70">
                {isUser ? 'You' : 'CampusReels AI'}
              </span>
              <span className="text-xs opacity-50">
                {formatTime(message.timestamp)}
              </span>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
            </div>
            
            {!isUser && (
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => saveAsPointer(message.content)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Save as Pointer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-blue-400 mb-2">
            AI Homework Helper
          </h1>
          <p className="text-gray-600 dark:text-blue-300">
            Get step-by-step guidance for your homework questions
          </p>
          
          {/* AI Status Banner */}
          {isMockMode() ? (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Demo mode: Using mock responses. Add VITE_GEMINI_KEY to your .env.local for real Google AI assistance.
              </span>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-green-800 dark:text-green-200">
                Connected to Google AI (Gemini 1.5 Flash) - Real AI assistance active!
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Chat History Sidebar */}
          {showChatHistory && (
            <div className="lg:col-span-1">
              <Card className="h-[500px] lg:h-[600px]">
                <ChatLogsList
                  onSelectLog={loadChatLog}
                  selectedLogId={currentChatLog?.id}
                  onNewChat={startNewChat}
                />
              </Card>
            </div>
          )}
          
          {/* Chat Area */}
          <div className={showChatHistory ? "lg:col-span-3" : "lg:col-span-4"}>
            <Card className="h-[500px] lg:h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-blue-400">CampusReels AI</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isMockMode() ? 'Demo Mode' : 'Google AI Active'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                  
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startNewChat}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      New Chat
                    </Button>
                  )}
                  
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-full text-center"
                    >
                      <div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-blue-400 mb-2">
                          Start a conversation
                        </h3>
                        <p className="text-gray-600 dark:text-blue-300 mb-4">
                          Ask me anything about your courses or homework!
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Try: "Help me understand derivatives" or "Explain photosynthesis"
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    messages.map(renderMessage)
                  )}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isMockMode() ? 'Generating response...' : 'Google AI is thinking...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a homework question..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      Press Enter to send
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  CampusReels AI can help with math, science, coding, and more. Be specific for better answers!
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Selection */}
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Course Context</h3>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a course (optional)</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Tips */}
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Be specific about what you need help with</li>
                  <li>• Include relevant formulas or concepts</li>
                  <li>• Ask for step-by-step explanations</li>
                  <li>• Save helpful responses as pointers</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
