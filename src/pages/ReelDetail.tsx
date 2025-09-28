import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share, Play, Pause } from 'lucide-react';
import { storage } from '../lib/storage';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function ReelDetail() {
  const { id } = useParams<{ id: string }>();
  const reels = storage.getReels();
  const reel = reels.find(r => r.id === id);

  if (!reel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reel not found</h1>
          <Link to="/">
            <Button>Back to Feed</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  // Get user info
  const users = storage.getUsers();
  const user = users.find(u => u.id === reel.userId);
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                <video
                  src={reel.videoUrl}
                  poster={reel.thumbUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar
                  src={userAvatar}
                  alt={user?.name || 'User'}
                  size="lg"
                />
                <div>
                  <Link
                    to={`/profile/${reel.userId}`}
                    className="font-semibold text-gray-900 hover:text-primary-600"
                  >
                    @{reel.userId}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgo(reel.createdAt)}
                  </div>
                </div>
              </div>

              {/* Course Badge */}
              {reel.courseId && (
                <div className="mb-4">
                  <Badge variant="primary" size="md">
                    {reel.courseId}
                  </Badge>
                </div>
              )}

              {/* Caption */}
              <p className="text-gray-800 leading-relaxed">
                {reel.caption}
              </p>

              {/* Tags */}
              {reel.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {reel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Like ({reel.likes})
                </Button>
                <Button variant="outline" className="w-full justify-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comment ({reel.comments})
                </Button>
                <Button variant="outline" className="w-full justify-center">
                  <Share className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Related Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">More from this course</h3>
              <div className="text-sm text-gray-500">
                {reel.courseId ? (
                  <Link
                    to={`/courses/${reel.courseId}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View all content from {reel.courseId}
                  </Link>
                ) : (
                  'No course specified'
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
