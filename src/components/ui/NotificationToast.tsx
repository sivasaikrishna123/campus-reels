import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { notifications, Notification } from '../../lib/notifications';

const NotificationToast: React.FC = () => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notifications.subscribe(setNotificationList);
    return unsubscribe;
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notificationList.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`p-4 rounded-lg border shadow-lg ${getBackgroundColor(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold ${getTextColor(notification.type)}`}>
                  {notification.title}
                </h4>
                <p className={`text-sm mt-1 ${getTextColor(notification.type)} opacity-90`}>
                  {notification.message}
                </p>
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className={`mt-2 text-xs font-medium ${getTextColor(notification.type)} hover:underline flex items-center space-x-1`}
                  >
                    <span>{notification.action.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => notifications.remove(notification.id)}
                className={`flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${getTextColor(notification.type)}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;

