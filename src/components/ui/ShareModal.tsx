import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, MessageCircle, Mail, Twitter, Facebook, Link2, Check } from 'lucide-react';
import { storage } from '../../lib/storage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    type: 'reel' | 'post' | 'pointer';
    title: string;
    description?: string;
    author: string;
    url?: string;
  };
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, content }) => {
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<string | null>(null);

  const shareUrl = content.url || `${window.location.origin}/${content.type}/${content.id}`;
  const shareText = `Check out this ${content.type} by ${content.author} on CampusReels: ${content.title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Track the share
      storage.addShare({
        id: Date.now().toString(),
        contentId: content.id,
        contentType: content.type,
        method: 'copy_link',
        timestamp: new Date().toISOString(),
        url: shareUrl
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    setShareMethod(platform);
    
    let shareUrl = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Check out this ${content.type} on CampusReels`)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
    }

    // Track the share
    storage.addShare({
      id: Date.now().toString(),
      contentId: content.id,
      contentType: content.type,
      method: platform as 'copy_link' | 'twitter' | 'facebook' | 'whatsapp' | 'telegram' | 'email',
      timestamp: new Date().toISOString(),
      url: shareUrl
    });

    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    setTimeout(() => setShareMethod(null), 1000);
  };

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: Copy, color: 'text-blue-500' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'telegram', label: 'Telegram', icon: MessageCircle, color: 'text-blue-400' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'email', label: 'Email', icon: Mail, color: 'text-gray-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share {content.type}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {content.author}
                  </p>
                  {content.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {content.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = shareMethod === option.id || (option.id === 'copy' && copied);
                  
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (option.id === 'copy') {
                          handleCopyLink();
                        } else {
                          handleSocialShare(option.id);
                        }
                      }}
                      disabled={isActive}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isActive ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {isActive && option.id === 'copy' ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : option.color}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {isActive && option.id === 'copy' ? 'Copied!' : option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Direct Link */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Link2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Direct Link</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-400"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
