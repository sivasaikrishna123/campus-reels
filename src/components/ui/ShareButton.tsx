import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Eye } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  content: {
    id: string;
    type: 'reel' | 'post' | 'pointer';
    title: string;
    description?: string;
    author: string;
    url?: string;
  };
  shareCount?: number;
  viewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'icon-only';
  showCounts?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  content,
  shareCount = 0,
  viewCount = 0,
  size = 'md',
  variant = 'default',
  showCounts = true
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (variant === 'icon-only') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsShareModalOpen(true)}
          className={`${sizeClasses[size]} rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group touch-manipulation`}
          aria-label="Share"
        >
          <Share2 className={`${iconSizes[size]} text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors`} />
        </motion.button>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          content={content}
        />
      </>
    );
  }

  if (variant === 'minimal') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Share2 className={iconSizes[size]} />
          <span className={textSizes[size]}>Share</span>
        </motion.button>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          content={content}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsShareModalOpen(true)}
        className={`${sizeClasses[size]} rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
            <Share2 className={`${iconSizes[size]} text-blue-600 dark:text-blue-400`} />
          </div>
          
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-1">
              <span className={`${textSizes[size]} font-medium text-gray-900 dark:text-white`}>
                Share
              </span>
              {shareCount > 0 && (
                <span className={`${textSizes[size]} text-gray-500 dark:text-gray-400`}>
                  ({shareCount})
                </span>
              )}
            </div>
            
            {showCounts && viewCount > 0 && (
              <div className="flex items-center space-x-1 mt-1">
                <Eye className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {viewCount.toLocaleString()} views
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.button>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        content={content}
      />
    </>
  );
};
