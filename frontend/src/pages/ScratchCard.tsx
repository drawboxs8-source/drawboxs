import { motion } from 'motion/react';
import { Sparkles, Coins, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState, useRef, useEffect } from 'react';

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [coinReward] = useState(Math.floor(Math.random() * 200) + 50); // Random 50-250
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Draw scratch layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) {
        transparent++;
      }
    }

    const progress = (transparent / (pixels.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > 60 && !revealed) {
      setRevealed(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const resetCard = () => {
    setRevealed(false);
    setScratchProgress(0);
    setShowConfetti(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw scratch layer
    ctx.globalCompositeOperation = 'source-over';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="pt-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Scratch & Win</h1>
            <p className="text-slate-600 dark:text-slate-400">Reveal your coin reward!</p>
          </motion.div>

          {/* Scratch Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard neonBorder className="p-8">
              <div className="relative max-w-md mx-auto">
                {/* Reward behind canvas */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: revealed ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6 shadow-2xl">
                      <Coins className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-6xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                        {coinReward}
                      </div>
                      <div className="text-2xl font-bold">COINS!</div>
                    </div>
                  </motion.div>
                </div>

                {/* Scratch Canvas */}
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-md mx-auto cursor-pointer rounded-3xl shadow-2xl"
                  onMouseDown={() => setIsScratching(true)}
                  onMouseUp={() => setIsScratching(false)}
                  onMouseMove={scratch}
                  onTouchStart={() => setIsScratching(true)}
                  onTouchEnd={() => setIsScratching(false)}
                  onTouchMove={scratch}
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Scratch Progress</span>
                  <span className="text-sm font-semibold">{Math.round(scratchProgress)}%</span>
                </div>
                <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full"
                    style={{ width: `${scratchProgress}%` }}
                  />
                </div>
              </div>

              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-4"
                >
                  <GlowButton variant="primary" className="w-full">
                    Claim {coinReward} Coins
                  </GlowButton>
                  <button
                    onClick={resetCard}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-cyan-500 dark:border-violet-500 hover:bg-cyan-500/10 dark:hover:bg-violet-500/10 transition-all font-semibold"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Another Card
                  </button>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-5%',
                    backgroundColor: ['#fbbf24', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
                  }}
                  animate={{
                    y: ['0vh', '100vh'],
                    x: [0, Math.random() * 100 - 50],
                    rotate: [0, 360],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Available Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Available Cards</h3>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">3 Cards Remaining</span>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-2xl ${
                      i < 3
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 cursor-pointer shadow-lg'
                        : 'bg-slate-300 dark:bg-slate-700'
                    } flex items-center justify-center text-4xl`}
                  >
                    {i < 3 ? '?' : '🔒'}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
                Upload more bills to unlock additional scratch cards
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
