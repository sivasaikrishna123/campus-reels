import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Post } from '../../types';
import { storage } from '../../lib/storage';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { ShareButton } from '../ui/ShareButton';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    
    // Update in storage
    storage.updatePost(post.id, { likes: newLiked ? likes + 1 : likes - 1 });
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

  // Get user avatar
  const users = storage.getUsers();
  const user = users.find(u => u.id === post.userId);
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

  // Simple markdown-like rendering for body preview
  const renderBodyPreview = (body: string) => {
    const preview = body.length > 200 ? body.substring(0, 200) + '...' : body;
    return preview.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-lg font-semibold text-gray-900 mb-2">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-base font-semibold text-gray-800 mb-1">{line.substring(3)}</h2>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-700 mb-1">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="text-gray-700 mb-2">{line}</p>;
      }
    });
  };

  return (
    <Card className="overflow-hidden" hover>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={userAvatar}
              alt={user?.name || 'User'}
              size="sm"
            />
            <div>
              <Link
                to={`/profile/${post.userId}`}
                className="font-medium text-gray-900 hover:text-primary-600"
              >
                @{post.userId}
              </Link>
              <div className="text-sm text-gray-500">
                {formatTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>

          {/* Course Badge */}
          {post.courseId && (
            <Badge variant="primary" size="sm">
              {post.courseId}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {post.title}
        </h2>

        {/* Body Preview */}
        <div className="text-gray-700 mb-4">
          {renderBodyPreview(post.body)}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Pointer Badge */}
        {post.isPointer && (
          <div className="mb-4">
            <Badge variant="secondary" size="sm">
              📌 Helpful Pointer
            </Badge>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <motion.button
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likes}</span>
            </motion.button>

            <Link
              to={`/post/${post.id}`}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary-600"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </Link>
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
                id: post.id,
                type: 'post',
                title: post.title,
                description: post.body.substring(0, 100) + (post.body.length > 100 ? '...' : ''),
                author: user?.name || `@${post.userId}`,
                url: `${window.location.origin}/post/${post.id}`
              }}
              shareCount={post.shares || 0}
              size="sm"
              variant="icon-only"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
