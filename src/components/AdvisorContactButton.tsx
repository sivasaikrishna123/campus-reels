import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Clock } from 'lucide-react';
import { Advisor } from '../types';
import { storage } from '../lib/storage';
import { AdvisorContactModal } from './AdvisorContactModal';

interface AdvisorContactButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export const AdvisorContactButton: React.FC<AdvisorContactButtonProps> = ({ 
  variant = 'floating',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Load advisors from storage
    const advisorsData = storage.getAdvisors();
    setAdvisors(advisorsData);
    
    // Count online advisors
    const onlineAdvisors = advisorsData.filter(advisor => advisor.isOnline);
    setOnlineCount(onlineAdvisors.length);
  }, []);

  if (variant === 'floating') {
    return (
      <>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className={`fixed bottom-32 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          title="Contact an Advisor"
        >
          <div className="relative">
            <Users className="w-6 h-6" />
            {onlineCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
              >
                <span className="text-xs font-bold text-white">{onlineCount}</span>
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* Online indicator tooltip */}
        {onlineCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-32 right-20 z-30 bg-green-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
          >
            {onlineCount} advisor{onlineCount !== 1 ? 's' : ''} online
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-green-600 rotate-45"></div>
          </motion.div>
        )}

        <AdvisorContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Contact Advisor</span>
        {onlineCount > 0 && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs">{onlineCount} online</span>
          </div>
        )}
      </motion.button>

      <AdvisorContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
