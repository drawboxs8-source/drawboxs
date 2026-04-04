import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
}

export default function GlowButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  type = 'button'
}: GlowButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/50 dark:shadow-violet-500/50 hover:shadow-xl hover:shadow-cyan-500/60 dark:hover:shadow-violet-500/60',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60',
    outline: 'border-2 border-cyan-500 dark:border-violet-500 bg-transparent hover:bg-cyan-500/10 dark:hover:bg-violet-500/10'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-semibold transition-all ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
