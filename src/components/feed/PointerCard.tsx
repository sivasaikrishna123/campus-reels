import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react';
import { Pointer } from '../../types';
import { storage } from '../../lib/storage';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ShareButton } from '../ui/ShareButton';

interface PointerCardProps {
  pointer: Pointer;
}

export default function PointerCard({ pointer }: PointerCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [upvotes, setUpvotes] = useState(pointer.upvotes);

  const handleUpvote = () => {
    const newUpvoted = !isUpvoted;
    setIsUpvoted(newUpvoted);
    setUpvotes(prev => newUpvoted ? prev + 1 : prev - 1);
    
    // Update in storage
    storage.updatePointer(pointer.id, { upvotes: newUpvoted ? upvotes + 1 : upvotes - 1 });
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary-500" hover>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-sm font-semibold">💡</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">
                Helpful Pointer • {formatTimeAgo(pointer.createdAt)}
              </div>
            </div>
          </div>

          {/* Course Badge */}
          {pointer.courseId && (
            <Badge variant="primary" size="sm">
              {pointer.courseId}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {pointer.title}
        </h3>

        {/* Body */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {pointer.body}
        </p>

        {/* Tags */}
        {pointer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {pointer.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <motion.button
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isUpvoted 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={handleUpvote}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{upvotes}</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsDown className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              className={`p-2 rounded-lg ${
                isBookmarked 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>

            <ShareButton
              content={{
                id: pointer.id,
                type: 'pointer',
                title: pointer.title,
                description: pointer.body.substring(0, 100) + (pointer.body.length > 100 ? '...' : ''),
                author: 'CampusReels Community',
                url: `${window.location.origin}/pointer/${pointer.id}`
              }}
              size="sm"
              variant="icon-only"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
