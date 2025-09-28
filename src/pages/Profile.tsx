import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Settings } from 'lucide-react';
import { storage } from '../lib/storage';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import ReelCard from '../components/feed/ReelCard';
import PostCard from '../components/feed/PostCard';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const users = storage.getUsers();
  const reels = storage.getReels();
  const posts = storage.getPosts();

  const user = users.find(u => u.username === username);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <Link to="/">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Back to Feed
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const userReels = reels.filter(reel => reel.userId === user.id);
  const userPosts = posts.filter(post => post.userId === user.id);
  const totalLikes = userReels.reduce((sum, reel) => sum + reel.likes, 0) + 
                    userPosts.reduce((sum, post) => sum + post.likes, 0);

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

        {/* Profile Header */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 mb-3">
                      @{user.username}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.courses.map(courseId => (
                        <Badge key={courseId} variant="primary" size="sm">
                          {courseId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {userReels.length}
                    </div>
                    <div className="text-sm text-gray-500">Reels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {userPosts.length}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {totalLikes}
                    </div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg bg-white shadow-sm">
              All Content
            </button>
            <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg">
              Reels
            </button>
            <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg">
              Posts
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {userReels.length === 0 && userPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-500">
              {user.username} hasn't shared any content yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reels */}
            {userReels.map((reel, index) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ReelCard reel={reel} />
              </motion.div>
            ))}

            {/* Posts */}
            {userPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (userReels.length + index) * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
