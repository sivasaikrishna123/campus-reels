import { motion } from 'framer-motion';
import FeedTabs from '../components/feed/FeedTabs';

export default function Feed() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-blue-400 mb-2">
            Campus Feed
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-blue-300">
            Discover reels, posts, and helpful pointers from your campus community
          </p>
        </div>

        <FeedTabs />
      </motion.div>
    </div>
  );
}
