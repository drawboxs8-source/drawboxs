import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Coins, RotateCw, Sparkles, Frown } from 'lucide-react';
import Header from '../components/Header';
import { API } from '../services/api';
import toast from 'react-hot-toast';

const wheelSlices = [
  { label: '2500\nCoins', color: '#ef4444' },
  { label: 'Better Luck', color: '#f8fafc', muted: true },
  { label: '1000\nCoins', color: '#2563eb' },
  { label: 'Better Luck', color: '#f8fafc', muted: true },
  { label: 'Better Luck', color: '#8b5cf6' },
  { label: '3500\nCoins', color: '#f59e0b' },
  { label: 'Better Luck', color: '#f8fafc', muted: true },
  { label: '5000\nCoins', color: '#6d28d9' },
];

const labelPositions = [
  { top: '13%', left: '50%', rotate: 0 },
  { top: '25%', left: '76%', rotate: 32 },
  { top: '50%', left: '84%', rotate: 90 },
  { top: '75%', left: '75%', rotate: 145 },
  { top: '84%', left: '50%', rotate: 180 },
  { top: '74%', left: '24%', rotate: -140 },
  { top: '50%', left: '15%', rotate: -90 },
  { top: '25%', left: '24%', rotate: -35 },
];

export default function SpinEarn() {
  const [coins, setCoins] = useState(0);
  const [spinCost, setSpinCost] = useState(3);
  const [planPurchased, setPlanPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('Better luck next time');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await API.get('/spin/status');
      setCoins(res.data.coins ?? 0);
      setPlanPurchased(Boolean(res.data.planPurchased));
      setSpinCost(res.data.spinCost ?? 3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load spin status');
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (spinning) return;

    if (!planPurchased) {
      toast.error('Buy a plan to use Spin & Earn');
      return;
    }

    setSpinning(true);

    try {
      const res = await API.post('/spin/play');
      setCoins(res.data.coins ?? 0);

      // Always land on a Better Luck slice.
      setRotation((prev) => prev + 360 * 5 + 47);

      window.setTimeout(() => {
        setResult(res.data.result || 'Better luck next time');
        setSpinning(false);
      }, 3000);
    } catch (error: any) {
      setSpinning(false);
      toast.error(error.response?.data?.message || 'Spin failed');
    }
  };

  const wheelBackground = `conic-gradient(
    ${wheelSlices[0].color} 0deg 45deg,
    ${wheelSlices[1].color} 45deg 90deg,
    ${wheelSlices[2].color} 90deg 135deg,
    ${wheelSlices[3].color} 135deg 180deg,
    ${wheelSlices[4].color} 180deg 225deg,
    ${wheelSlices[5].color} 225deg 270deg,
    ${wheelSlices[6].color} 270deg 315deg,
    ${wheelSlices[7].color} 315deg 360deg
  )`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f8ff]">
        <Header />
        <div className="flex min-h-[75vh] items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff] pb-12 text-slate-900 dark:bg-[#0b1020] dark:text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[34px] border border-white/70 bg-white p-4 shadow-[0_24px_80px_rgba(37,99,235,0.14)] dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div className="mx-auto max-w-xl rounded-[30px] bg-gradient-to-b from-white to-slate-50 px-4 py-6 shadow-inner dark:from-slate-900 dark:to-slate-950 sm:px-7 sm:py-8">
            <div className="mx-auto flex max-w-sm items-center justify-center rounded-full border border-[#cfe2ff] bg-[#e8f1ff] px-5 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="text-xl font-bold text-[#2b5c9f] dark:text-cyan-300">
                Your Coins: {coins}
              </span>
              <Coins className="ml-2 h-7 w-7 text-[#ffbf1f]" />
            </div>

            <div className="relative mx-auto mt-8 flex h-[290px] w-[290px] items-center justify-center sm:h-[430px] sm:w-[430px]">
              <div className="absolute -top-3 z-20 h-0 w-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-[#ffcf32] drop-shadow-[0_8px_10px_rgba(251,191,36,0.4)] sm:border-l-[22px] sm:border-r-[22px] sm:border-t-[42px]" />

              <div className="absolute inset-0 rounded-full bg-[#edf5ff] shadow-[0_12px_30px_rgba(59,130,246,0.22)]" />

              <div
                className="relative z-10 h-[270px] w-[270px] rounded-full border-[6px] border-[#b7d1f1] transition-transform duration-[3000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:h-[400px] sm:w-[400px] sm:border-[8px]"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div
                  className="absolute inset-0 rounded-full shadow-inner"
                  style={{ background: wheelBackground }}
                />

                {wheelSlices.map((slice, index) => {
                  const pos = labelPositions[index];
                  return (
                    <div
                      key={`${slice.label}-${index}`}
                      className={`absolute z-10 w-[82px] -translate-x-1/2 -translate-y-1/2 text-center text-[11px] font-extrabold leading-tight sm:w-[118px] sm:text-base ${
                        slice.muted ? 'text-slate-400' : 'text-white'
                      }`}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                      }}
                    >
                      {slice.label.split('\n').map((part) => (
                        <div key={part}>{part}</div>
                      ))}
                    </div>
                  );
                })}

                <div className="absolute inset-[32%] rounded-full bg-[radial-gradient(circle,_rgba(255,244,122,1)_0%,_rgba(255,182,39,1)_62%,_rgba(255,116,24,1)_100%)] opacity-95 sm:inset-[31%]" />
                <div className="absolute left-1/2 top-1/2 z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] sm:h-8 sm:w-8" />
              </div>

              <div className="absolute right-0 top-8 z-20 rounded-[24px] bg-[radial-gradient(circle_at_top,_#9c5bff,_#4e2a8e)] px-3 py-2 text-center text-white shadow-[0_12px_30px_rgba(147,51,234,0.4)] sm:right-2 sm:top-10 sm:px-4 sm:py-3">
                <div className="flex justify-center">
                  <Coins className="h-7 w-7 text-[#ffd54a] sm:h-9 sm:w-9" />
                </div>
                <div className="mt-1 text-xl font-black leading-none sm:text-3xl">10,000</div>
                <div className="text-xs font-bold sm:text-sm">Coins</div>
              </div>
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || !planPurchased}
              className="mt-8 w-full rounded-full bg-[linear-gradient(180deg,#2db7ff_0%,#245bff_100%)] px-6 py-4 text-xl font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.45),0_10px_0_#1d43c8,0_18px_34px_rgba(37,99,235,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65 sm:text-2xl"
            >
              <span className="inline-flex items-center gap-3">
                <RotateCw className={`h-6 w-6 ${spinning ? 'animate-spin' : ''}`} />
                {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
              </span>
            </button>

            <p className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">
              Every spin costs {spinCost} coins. Results are final.
            </p>

            {!planPurchased ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                Buy a plan first to unlock Spin & Earn.
              </div>
            ) : null}

            <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_20px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <Frown className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-black text-slate-700 dark:text-white">
                    {result}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
