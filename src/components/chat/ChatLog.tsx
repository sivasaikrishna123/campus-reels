import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Clock, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { ChatLog as ChatLogType } from '../../types';
import { storage } from '../../lib/storage';

interface ChatLogProps {
  log: ChatLogType;
  onSelect: (log: ChatLogType) => void;
  onDelete: (logId: string) => void;
  isSelected?: boolean;
}

export const ChatLog: React.FC<ChatLogProps> = ({ log, onSelect, onDelete, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPreviewText = () => {
    const lastMessage = log.messages[log.messages.length - 1];
    if (!lastMessage) return 'No messages';
    
    const preview = lastMessage.content.substring(0, 60);
    return preview.length < lastMessage.content.length ? preview + '...' : preview;
  };

  const handleDelete = () => {
    storage.setChatLogs(storage.getChatLogs().filter(l => l.id !== log.id));
    onDelete(log.id);
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-xl transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Main Log Item */}
      <div
        className={`p-4 cursor-pointer ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        onClick={() => onSelect(log)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <MessageCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {log.title}
              </h3>
              {log.courseId && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  {log.courseId}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {getPreviewText()}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(log.updatedAt)}</span>
              </div>
              <span>{log.messages.length} messages</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Messages Preview */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="space-y-3">
                {log.messages.slice(-3).map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs opacity-70">
                          {message.role === 'user' ? 'You' : 'AI'}
                        </span>
                        <span className="text-xs opacity-50">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">
                        {message.content.substring(0, 100)}
                        {message.content.length > 100 && '...'}
                      </p>
                    </div>
                  </div>
                ))}
                
                {log.messages.length > 3 && (
                  <div className="text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{log.messages.length - 3} more messages
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mx-4 max-w-sm w-full">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Delete Chat Log?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This will permanently delete "{log.title}" and all its messages.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

