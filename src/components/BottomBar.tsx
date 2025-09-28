import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, MessageCircle, Plus, User, Briefcase } from 'lucide-react';

export default function BottomBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/ask', icon: MessageCircle, label: 'Ask' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/upload', icon: Plus, label: 'Upload' },
    { path: '/profile/alex_chen', icon: User, label: 'Profile' }
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center justify-center flex-1 py-2"
          >
            <motion.div
              className={`p-2 rounded-xl transition-colors ${
                isActive(path)
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <span
              className={`text-xs mt-1 font-medium ${
                isActive(path) ? 'text-primary-600 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
