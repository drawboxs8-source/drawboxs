import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Coins, RotateCw, Frown } from 'lucide-react';
import Header from '../components/Header';
import { API } from '../services/api';
import toast from 'react-hot-toast';

type WheelSlice = {
  label: string;
  value?: string;
  angle: number;
  tone: 'light' | 'red' | 'blue' | 'purple' | 'orange';
};

const SPIN_DURATION_MS = 3200;

const wheelSlices: WheelSlice[] = [
  { label: '2500', value: 'Coins', angle: 22.5, tone: 'red' },
  { label: 'Better Luck', angle: 67.5, tone: 'light' },
  { label: '1000', value: 'Coins', angle: 112.5, tone: 'blue' },
  { label: 'Better Luck', angle: 157.5, tone: 'light' },
  { label: 'Better Luck', angle: 202.5, tone: 'purple' },
  { label: '3500', value: 'Coins', angle: 247.5, tone: 'orange' },
  { label: 'Better Luck', angle: 292.5, tone: 'light' },
  { label: '5000', value: 'Coins', angle: 337.5, tone: 'purple' },
];

const toneClasses: Record<WheelSlice['tone'], string> = {
  light: 'text-[#90a1bc]',
  red: 'text-white',
  blue: 'text-white',
  purple: 'text-white',
  orange: 'text-white',
};

function WheelLabel({ slice }: { slice: WheelSlice }) {
  const radius = 35;
  const radians = ((slice.angle - 90) * Math.PI) / 180;
  const x = 50 + Math.cos(radians) * radius;
  const y = 50 + Math.sin(radians) * radius;

  return (
    <div
      className="absolute left-0 top-0 h-full w-full"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={`absolute w-[88px] text-center font-black leading-tight sm:w-[108px] ${toneClasses[slice.tone]}`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${slice.angle}deg)`,
        }}
      >
        <div className={slice.tone === 'light' ? 'text-[13px] sm:text-[16px]' : 'text-[16px] sm:text-[20px]'}>
          {slice.label}
        </div>
        {slice.value ? (
          <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] sm:text-[13px]">
            {slice.value}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SpinWheel({ rotation }: { rotation: number }) {
  return (
    <div className="relative mx-auto h-[290px] w-[290px] sm:h-[420px] sm:w-[420px]">
      <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2">
        <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[40px] border-l-transparent border-r-transparent border-t-[#ffcc2f] drop-shadow-[0_10px_18px_rgba(245,158,11,0.45)] sm:border-l-[22px] sm:border-r-[22px] sm:border-t-[48px]" />
      </div>

      <div className="absolute inset-0 rounded-full bg-[#edf4ff] shadow-[0_18px_44px_rgba(37,99,235,0.20)]" />
      <div className="absolute inset-[8px] rounded-full border-[3px] border-[#cfe0f7] bg-white sm:inset-[12px] sm:border-[4px]" />

      <div
        className="absolute inset-[18px] overflow-hidden rounded-full border-[4px] border-[#b9d1f2] transition-transform ease-[cubic-bezier(0.16,0.86,0.24,1)] sm:inset-[22px]"
        style={{
          background:
            'conic-gradient(from -22.5deg, #ef4444 0deg 45deg, #f8fbff 45deg 90deg, #176ee6 90deg 135deg, #f8fbff 135deg 180deg, #7a3ff0 180deg 225deg, #ff8a18 225deg 270deg, #f8fbff 270deg 315deg, #5a31d3 315deg 360deg)',
          transform: `rotate(${rotation}deg)`,
          transitionDuration: `${SPIN_DURATION_MS}ms`,
        }}
      >
        <div className="absolute inset-0 rounded-full">
          {wheelSlices.map((slice) => (
            <WheelLabel key={`${slice.label}-${slice.angle}`} slice={slice} />
          ))}
        </div>

        <div
          className="absolute inset-[74px] rounded-full border-[10px] border-[#fff3b4] shadow-[inset_0_8px_18px_rgba(255,255,255,0.25)] sm:inset-[104px]"
          style={{
            background: 'radial-gradient(circle, #ffd645 0%, #ffb523 60%, #f97b18 100%)',
          }}
        />
        <div className="absolute left-1/2 top-1/2 z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#d5e1f4] bg-white shadow-md sm:h-8 sm:w-8" />
      </div>

      <div
        className="absolute right-0 top-[54px] z-30 rounded-[28px] border border-[#9f78ff] px-3 py-2 text-center text-white shadow-[0_16px_26px_rgba(109,59,227,0.35)] sm:right-1 sm:top-[72px] sm:px-4 sm:py-3"
        style={{
          background: 'radial-gradient(circle at top, #a56aff 0%, #6d3be3 58%, #4b27b2 100%)',
        }}
      >
        <div className="flex justify-center">
          <Coins className="h-8 w-8 text-[#ffd54a] sm:h-10 sm:w-10" />
        </div>
        <div className="mt-1 text-[24px] font-black leading-none sm:text-[32px]">10,000</div>
        <div className="text-xs font-bold sm:text-sm">Coins</div>
      </div>
    </div>
  );
}

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
      setRotation((prev) => prev + 360 * 5 - 67.5);

      window.setTimeout(() => {
        setResult(res.data.result || 'Better luck next time');
        setSpinning(false);
      }, SPIN_DURATION_MS);
    } catch (error: any) {
      setSpinning(false);
      toast.error(error.response?.data?.message || 'Spin failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef5ff]">
        <Header />
        <div className="flex min-h-[75vh] items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef5ff] pb-14 text-slate-900 dark:bg-[#0b1020] dark:text-white">
      <Header />

      <main className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[36px] bg-white px-4 py-6 shadow-[0_26px_80px_rgba(30,64,175,0.14)] dark:bg-[#0f172a] sm:px-8 sm:py-8"
        >
          <div className="mx-auto max-w-[620px] rounded-[40px] bg-[#fefefe] px-4 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:bg-[#111c34] sm:px-8 sm:py-10">
            <div className="mx-auto flex max-w-[420px] items-center justify-center rounded-full border border-[#cfdcf1] bg-[#e6f0fd] px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-[#162844]">
              <span className="text-[18px] font-black text-[#27538e] dark:text-[#9dccff] sm:text-[20px]">
                Your Coins: {coins}
              </span>
              <Coins className="ml-2 h-7 w-7 text-[#ffbf1f]" />
            </div>

            <div className="mt-8">
              <SpinWheel rotation={rotation} />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || !planPurchased}
              className="mt-8 w-full rounded-full px-6 py-4 text-xl font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.42),0_6px_0_#163cc4,0_16px_30px_rgba(37,99,235,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65 sm:text-[22px]"
              style={{
                background: 'linear-gradient(180deg, #27b5ff 0%, #204bff 100%)',
              }}
            >
              <span className="inline-flex items-center gap-3">
                <RotateCw className={`h-6 w-6 ${spinning ? 'animate-spin' : ''}`} />
                {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
              </span>
            </button>

            <p className="mt-5 text-center text-sm font-medium text-[#687a96] dark:text-slate-400 sm:text-base">
              Every spin costs {spinCost} coins. Results are final.
            </p>

            {!planPurchased ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Buy a plan first to unlock Spin & Earn.
              </div>
            ) : null}

            <div className="mt-6 border-t border-[#e5edf8] pt-6 dark:border-slate-800">
              <div className="rounded-[24px] border border-[#dde7f4] bg-white px-5 py-5 shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-[#0f172a]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2f8] text-[#7385a1] dark:bg-slate-800 dark:text-slate-300">
                    <Frown className="h-8 w-8" />
                  </div>
                  <div className="text-[22px] font-black text-[#334a68] dark:text-white sm:text-[24px]">
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
