import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  neonBorder?: boolean;
}

export default function GlassCard({ children, className = '', hover = false, neonBorder = false }: GlassCardProps) {
  const baseClasses = `
    backdrop-blur-xl bg-white/70 dark:bg-slate-900/50
    border border-white/20 dark:border-slate-700/50
    rounded-3xl shadow-xl
    ${neonBorder ? 'ring-1 ring-cyan-400/50 dark:ring-violet-500/50' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
