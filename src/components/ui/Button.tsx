import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-xl focus-ring transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300',
    secondary: 'bg-primary-100 text-primary-700 hover:bg-primary-200 disabled:bg-gray-100',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-gray-300',
    ghost: 'text-primary-600 hover:bg-primary-50 disabled:text-gray-400'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  );
}
