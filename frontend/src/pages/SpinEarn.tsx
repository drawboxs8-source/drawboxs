import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Coins, Sparkles, RotateCw, Lock } from 'lucide-react';
import Header from '../components/Header';
import { API } from '../services/api';
import toast from 'react-hot-toast';

const wheelLabels = [
  'Better Luck',
  '2500',
  'Better Luck',
  '1000',
  'Better Luck',
  '3500',
  'Better Luck',
  '5000',
];

export default function SpinEarn() {
  const [coins, setCoins] = useState(0);
  const [spinCost, setSpinCost] = useState(3);
  const [planPurchased, setPlanPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState('');

  useEffect(() => {
    fetchSpinStatus();
  }, []);

  const fetchSpinStatus = async () => {
    try {
      const res = await API.get('/spin/status');
      setCoins(res.data.coins ?? 0);
      setSpinCost(res.data.spinCost ?? 3);
      setPlanPurchased(Boolean(res.data.planPurchased));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load spin game');
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (!planPurchased) {
      toast.error('Please purchase a plan to use Spin & Earn');
      return;
    }

    if (spinning) return;

    setSpinning(true);
    setResult('');

    try {
      const res = await API.post('/spin/play');
      setCoins(res.data.coins);

      // The backend always returns Better luck next time. Keep the animation honest by landing on that slice.
      setRotation((current) => current + 360 * 5 + 18);

      window.setTimeout(() => {
        setResult(res.data.result || 'Better luck next time');
        setSpinning(false);
      }, 2200);
    } catch (err: any) {
      setSpinning(false);
      toast.error(err.response?.data?.message || 'Failed to spin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] dark:bg-slate-950">
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] pb-16 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Spin & Earn
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Spin and try your luck
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Every spin costs {spinCost} coins. This game is available only for users with an active plan.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    <Coins className="h-4 w-4 text-amber-500" />
                    Coins
                  </div>
                  <div className="mt-2 text-3xl font-black">{coins}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Spin cost</div>
                  <div className="mt-2 text-3xl font-black">{spinCost}</div>
                </div>
              </div>

              {!planPurchased ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  <Lock className="mr-2 inline h-4 w-4" />
                  Buy a plan to unlock Spin & Earn.
                </div>
              ) : null}
            </div>

            <div className="flex flex-col items-center">
              <div className="relative flex h-[310px] w-[310px] items-center justify-center sm:h-[390px] sm:w-[390px]">
                <div className="absolute -top-1 z-10 h-0 w-0 border-x-[18px] border-t-[30px] border-x-transparent border-t-red-600 drop-shadow-lg" />

                <div
                  className="relative h-[280px] w-[280px] rounded-full border-[10px] border-white shadow-[0_18px_55px_rgba(15,23,42,0.22)] transition-transform duration-[2200ms] ease-out dark:border-slate-800 sm:h-[350px] sm:w-[350px]"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    background:
                      'conic-gradient(#f97316 0deg 45deg, #22c55e 45deg 90deg, #06b6d4 90deg 135deg, #eab308 135deg 180deg, #8b5cf6 180deg 225deg, #ef4444 225deg 270deg, #14b8a6 270deg 315deg, #f59e0b 315deg 360deg)',
                  }}
                >
                  <div className="absolute inset-8 rounded-full border border-white/40 bg-white/15" />
                  {wheelLabels.map((label, index) => (
                    <div
                      key={`${label}-${index}`}
                      className="absolute left-1/2 top-1/2 w-[118px] origin-left text-[10px] font-black uppercase text-white drop-shadow sm:w-[150px] sm:text-xs"
                      style={{ transform: `rotate(${index * 45 + 22.5}deg) translateX(26px)` }}
                    >
                      <span className="block -rotate-12">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute flex h-20 w-20 items-center justify-center rounded-full border-8 border-white bg-gradient-to-br from-cyan-500 to-blue-600 text-center text-xs font-black uppercase text-white shadow-xl dark:border-slate-900">
                  Spin
                </div>
              </div>

              <button
                onClick={handleSpin}
                disabled={spinning || !planPurchased}
                className="mt-4 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCw className={`h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
                {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
              </button>

              <div className="mt-5 min-h-[76px] w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-950">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Result</div>
                <div className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                  {result || 'Press start to spin'}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
