import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { SupportModal } from './SupportModal';

interface SupportButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export const SupportButton: React.FC<SupportButtonProps> = ({ 
  variant = 'floating',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'floating') {
    return (
      <>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className={`fixed bottom-20 right-6 z-40 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          title="Get Help"
        >
          <HelpCircle className="w-6 h-6" />
        </motion.button>

        <SupportModal
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
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <HelpCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Support</span>
      </motion.button>

      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
