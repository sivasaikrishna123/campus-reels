import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Play, Pause } from 'lucide-react';
import { Reel } from '../../types';
import { storage } from '../../lib/storage';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { ShareButton } from '../ui/ShareButton';

interface ReelCardProps {
  reel: Reel;
}

export default function ReelCard({ reel }: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Intersection Observer to pause video when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Video event handlers
  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Video failed to load:', reel.videoUrl);
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing video:', error);
        // Fallback: try to play with user interaction
        if (videoRef.current.paused) {
          videoRef.current.play().catch(console.error);
        }
      }
    }
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    
    // Update in storage
    storage.updateReel(reel.id, { likes: newLiked ? likes + 1 : likes - 1 });
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
  const user = users.find(u => u.id === reel.userId);
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

  return (
    <Card className="overflow-hidden" hover>
      <div className="relative">
        {/* Video */}
        <div className="relative aspect-[9/16] bg-gray-100">
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <Play className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Video unavailable</p>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={reel.videoUrl}
                poster={reel.thumbUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                onClick={handlePlayPause}
              />
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
              
              {/* Play/Pause Overlay */}
              {!isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <motion.button
                    className="p-3 sm:p-4 bg-white/90 rounded-full shadow-lg touch-manipulation"
                    onClick={handlePlayPause}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 ml-0.5 sm:ml-1" />
                    )}
                  </motion.button>
                </div>
              )}
            </>
          )}

          {/* Course Badge */}
          {reel.courseId && (
            <div className="absolute top-4 left-4">
              <Badge variant="primary" size="sm">
                {reel.courseId}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-3">
            <Avatar
              src={userAvatar}
              alt={user?.name || 'User'}
              size="sm"
            />
            <div className="flex-1">
              <Link
                to={`/profile/${reel.userId}`}
                className="font-medium text-gray-900 hover:text-primary-600"
              >
                @{reel.userId}
              </Link>
              <div className="text-sm text-gray-500">
                {formatTimeAgo(reel.createdAt)}
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="text-gray-800 mb-4 line-clamp-3">
            {reel.caption}
          </p>

          {/* Tags */}
          {reel.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {reel.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
                to={`/reel/${reel.id}`}
                className="flex items-center space-x-2 text-gray-500 hover:text-primary-600"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{reel.comments}</span>
              </Link>
            </div>

            <ShareButton
              content={{
                id: reel.id,
                type: 'reel',
                title: reel.caption,
                description: `A ${reel.courseId ? reel.courseId + ' ' : ''}reel by @${reel.userId}`,
                author: user?.name || `@${reel.userId}`,
                url: `${window.location.origin}/reel/${reel.id}`
              }}
              shareCount={reel.shares || 0}
              viewCount={reel.views || 0}
              size="sm"
              variant="icon-only"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
