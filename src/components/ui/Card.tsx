import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
      whileHover={hover ? { scale: 1.015, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
