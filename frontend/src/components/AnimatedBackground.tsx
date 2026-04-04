import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedBackground() {
  const { theme } = useTheme();

  const spheres = [
    { size: 400, x: '10%', y: '20%', duration: 20, delay: 0 },
    { size: 300, x: '80%', y: '60%', duration: 25, delay: 2 },
    { size: 350, x: '60%', y: '10%', duration: 22, delay: 4 },
    { size: 250, x: '20%', y: '70%', duration: 18, delay: 1 },
    { size: 200, x: '90%', y: '30%', duration: 28, delay: 3 },
  ];

  const lightGradients = [
    'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(167, 243, 208, 0.3) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(252, 211, 77, 0.3) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, transparent 70%)',
  ];

  const darkGradients = [
    'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
  ];

  const gradients = theme === 'light' ? lightGradients : darkGradients;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/20 dark:to-purple-900/20" />
      
      {/* Animated floating spheres */}
      {spheres.map((sphere, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: sphere.size,
            height: sphere.size,
            left: sphere.x,
            top: sphere.y,
            background: gradients[index],
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: sphere.duration,
            delay: sphere.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Particle effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/30 dark:bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
