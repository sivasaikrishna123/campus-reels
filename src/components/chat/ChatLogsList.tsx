import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Plus, Search, Filter, Calendar } from 'lucide-react';
import { ChatLog as ChatLogType } from '../../types';
import { storage } from '../../lib/storage';
import { ChatLog } from './ChatLog';

interface ChatLogsListProps {
  onSelectLog: (log: ChatLogType) => void;
  selectedLogId?: string;
  onNewChat: () => void;
}

export const ChatLogsList: React.FC<ChatLogsListProps> = ({ 
  onSelectLog, 
  selectedLogId, 
  onNewChat 
}) => {
  const [logs, setLogs] = useState<ChatLogType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const allLogs = storage.getChatLogs();
    setLogs(allLogs);
  };

  const filteredAndSortedLogs = logs
    .filter(log => {
      const matchesSearch = log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCourse = filterCourse === 'all' || log.courseId === filterCourse;
      
      return matchesSearch && matchesCourse;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.updatedAt - a.updatedAt;
        case 'oldest':
          return a.updatedAt - b.updatedAt;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleDeleteLog = (logId: string) => {
    setLogs(prev => prev.filter(log => log.id !== logId));
  };

  const getUniqueCourses = () => {
    const courses = new Set<string>();
    logs.forEach(log => {
      if (log.courseId) courses.add(log.courseId);
    });
    return Array.from(courses);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chat History
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewChat}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Courses</option>
            {getUniqueCourses().map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredAndSortedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || filterCourse !== 'all' ? 'No matching conversations' : 'No conversations yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || filterCourse !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start a new conversation with the AI assistant'
              }
            </p>
            {!searchQuery && filterCourse === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewChat}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Start New Chat
              </motion.button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAndSortedLogs.map((log) => (
                <ChatLog
                  key={log.id}
                  log={log}
                  onSelect={onSelectLog}
                  onDelete={handleDeleteLog}
                  isSelected={selectedLogId === log.id}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Stats */}
      {logs.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{logs.length} conversations</span>
            <span>{logs.reduce((total, log) => total + log.messages.length, 0)} total messages</span>
          </div>
        </div>
      )}
    </div>
  );
};

