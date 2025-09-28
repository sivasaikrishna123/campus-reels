import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className={className}>
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
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {tab.label}
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {tabs.find(tab => tab.id === activeTab)?.content}
      </motion.div>
    </div>
  );
}
