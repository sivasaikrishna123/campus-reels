import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { University } from '../../types';
import { universities } from '../../data/universities';

interface UniversitySelectProps {
  value: string;
  onChange: (value: string) => void;
  onUniversitySelect: (university: University | null) => void;
  error?: string;
  disabled?: boolean;
}

export const UniversitySelect: React.FC<UniversitySelectProps> = ({
  value,
  onChange,
  onUniversitySelect,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>(universities);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter universities based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (uni.state && uni.state.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUniversities(filtered);
    }
  }, [searchQuery]);

  // Find selected university when value changes
  useEffect(() => {
    const university = universities.find(uni => uni.name === value);
    setSelectedUniversity(university || null);
    onUniversitySelect(university || null);
  }, [value, onUniversitySelect]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSearchQuery(newValue);
    setIsOpen(true);
  };

  const handleUniversityClick = (university: University) => {
    onChange(university.name);
    setSelectedUniversity(university);
    onUniversitySelect(university);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search for your university..."
          disabled={disabled}
          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {/* Search within dropdown */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search universities..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* University list */}
            <div className="py-1">
              {filteredUniversities.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No universities found
                </div>
              ) : (
                filteredUniversities.map((university) => (
                  <motion.button
                    key={university.id}
                    onClick={() => handleUniversityClick(university)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {university.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {university.state && `${university.state}, `}{university.country}
                        {university.primaryDomain && ` • ${university.primaryDomain}`}
                      </div>
                    </div>
                    {selectedUniversity?.id === university.id && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </motion.button>
                ))
              )}
            </div>

            {/* Custom university option */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <button
                onClick={() => {
                  const customUni: University = {
                    id: 'custom',
                    name: value || 'Custom University',
                    country: 'International'
                  };
                  handleUniversityClick(customUni);
                }}
                className="w-full px-3 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                Can't find your university? Click here to add it manually
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
