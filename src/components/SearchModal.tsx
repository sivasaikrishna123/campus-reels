import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Hash, User, BookOpen, Video, FileText, Lightbulb } from 'lucide-react';
import { searchEngine, SearchResult, SearchFilters } from '../lib/search';
import { validators } from '../lib/validation';
import { notifications } from '../lib/notifications';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick?: (result: SearchResult) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      loadTrendingTags();
      loadRecentSearches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
      loadSuggestions();
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query, filters]);

  const loadTrendingTags = () => {
    setTrendingTags(searchEngine.getTrendingTags());
  };

  const loadRecentSearches = () => {
    const recent = localStorage.getItem('campus_reels_recent_searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const recent = recentSearches.filter(s => s !== searchQuery);
    recent.unshift(searchQuery);
    const updated = recent.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('campus_reels_recent_searches', JSON.stringify(updated));
  };

  const performSearch = () => {
    setIsSearching(true);
    try {
      const validation = validators.search.validate({ search: query });
      if (!validation.isValid) {
        notifications.error('Invalid Search', validation.errors.search || 'Search query is invalid');
        return;
      }

      const searchResults = searchEngine.search(query, filters);
      setResults(searchResults);
    } catch (error) {
      notifications.error('Search Error', 'Failed to perform search');
    } finally {
      setIsSearching(false);
    }
  };

  const loadSuggestions = () => {
    if (query.length >= 2) {
      const suggestionList = searchEngine.getSuggestions(query);
      setSuggestions(suggestionList);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    saveRecentSearch(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onResultClick?.(result);
    onClose();
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'reel':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'post':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'pointer':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'user':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'course':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'reel':
        return 'Reel';
      case 'post':
        return 'Post';
      case 'pointer':
        return 'Pointer';
      case 'user':
        return 'User';
      case 'course':
        return 'Course';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search reels, posts, users, courses..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Recent Searches
                      </h3>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <span className="text-gray-600 dark:text-gray-400">{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Tags */}
                  {trendingTags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Trending Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {trendingTags.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(`#${tag}`)}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center"
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  {/* Search Results */}
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Search Results ({results.length})
                      </h3>
                      {results.map((result) => (
                        <motion.button
                          key={`${result.type}_${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                  {result.title}
                                </h4>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                  {getResultTypeLabel(result.type)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {result.description}
                              </p>
                              {result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Try different keywords or check your spelling
                      </p>
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Suggestions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(suggestion)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

