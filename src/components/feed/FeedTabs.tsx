import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../../lib/storage';
import ReelCard from './ReelCard';
import PostCard from './PostCard';
import PointerCard from './PointerCard';

type TabType = 'all' | 'courses' | 'pointers';

export default function FeedTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const reels = storage.getReels();
  const posts = storage.getPosts();
  const pointers = storage.getPointers();

  // Combine and sort all content by creation date
  const allContent = [
    ...reels.map(reel => ({ ...reel, type: 'reel' as const })),
    ...posts.map(post => ({ ...post, type: 'post' as const })),
    ...pointers.map(pointer => ({ ...pointer, type: 'pointer' as const }))
  ].sort((a, b) => b.createdAt - a.createdAt);

  // Filter content based on active tab
  const getFilteredContent = () => {
    switch (activeTab) {
      case 'courses':
        return allContent.filter(item => item.courseId);
      case 'pointers':
        return allContent.filter(item => item.type === 'pointer');
      default:
        return allContent;
    }
  };

  const filteredContent = getFilteredContent();

  const tabs = [
    { id: 'all' as TabType, label: 'All', count: allContent.length },
    { id: 'courses' as TabType, label: 'My Courses', count: allContent.filter(item => item.courseId).length },
    { id: 'pointers' as TabType, label: 'Pointers', count: allContent.filter(item => item.type === 'pointer').length }
  ];

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium relative focus-ring ${
              activeTab === tab.id
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                layoutId="activeTab"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No content found</div>
            <div className="text-gray-500 text-sm">
              {activeTab === 'all' && 'Start by uploading your first reel or post!'}
              {activeTab === 'courses' && 'No content from your enrolled courses yet.'}
              {activeTab === 'pointers' && 'No helpful pointers available yet.'}
            </div>
          </div>
        ) : (
          filteredContent.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.type === 'reel' && <ReelCard reel={item} />}
              {item.type === 'post' && <PostCard post={item} />}
              {item.type === 'pointer' && <PointerCard pointer={item} />}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
