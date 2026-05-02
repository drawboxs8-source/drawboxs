import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Coins, RotateCw, Frown } from 'lucide-react';
import Header from '../components/Header';
import { API } from '../services/api';
import toast from 'react-hot-toast';

type Slice = {
  label: string;
  color: string;
  textColor: string;
};

const SPIN_DURATION_MS = 3200;

const slices: Slice[] = [
  { label: '2500\nCoins', color: '#ef4444', textColor: '#ffffff' },
  { label: 'Better Luck', color: '#f8fafc', textColor: '#7c8aa5' },
  { label: '1000\nCoins', color: '#1d74e7', textColor: '#ffffff' },
  { label: 'Better Luck', color: '#f8fafc', textColor: '#7c8aa5' },
  { label: 'Better\nLuck', color: '#6d3ce8', textColor: '#ffffff' },
  { label: '3500\nCoins', color: '#ff8b17', textColor: '#ffffff' },
  { label: 'Better Luck', color: '#f8fafc', textColor: '#7c8aa5' },
  { label: '5000\nCoins', color: '#5b2fd4', textColor: '#ffffff' },
];

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describeSlice(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function SpinWheel({ rotation }: { rotation: number }) {
  const size = 360;
  const center = size / 2;
  const radius = 165;
  const sliceAngle = 360 / slices.length;

  return (
    <div className="relative h-[300px] w-[300px] sm:h-[430px] sm:w-[430px]">
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[42px] border-l-transparent border-r-transparent border-t-[#ffca28] drop-shadow-[0_8px_12px_rgba(245,158,11,0.4)] sm:border-l-[22px] sm:border-r-[22px] sm:border-t-[52px]" />
      </div>

      <div className="absolute inset-0 rounded-full bg-[#edf4ff] shadow-[0_14px_36px_rgba(59,130,246,0.20)]" />

      <div
        className="absolute inset-[10px] rounded-full border-[6px] border-[#bed5f4] bg-white transition-transform ease-[cubic-bezier(0.2,0.85,0.22,1)] sm:inset-[14px] sm:border-[8px]"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${SPIN_DURATION_MS}ms` }}
      >
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
          {slices.map((slice, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const textPoint = polarToCartesian(center, center, 110, midAngle);
            const textRotation = midAngle;

            return (
              <g key={`${slice.label}-${index}`}>
                <path d={describeSlice(center, center, radius, startAngle, endAngle)} fill={slice.color} stroke="#dbeafe" strokeWidth="2" />
                <text
                  x={textPoint.x}
                  y={textPoint.y}
                  fill={slice.textColor}
                  fontSize="13"
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation} ${textPoint.x} ${textPoint.y})`}
                >
                  {slice.label.split('\n').map((line, lineIndex) => (
                    <tspan key={line + lineIndex} x={textPoint.x} dy={lineIndex === 0 ? 0 : 15}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          <circle cx={center} cy={center} r="74" fill="url(#innerGlow)" opacity="0.98" />
          <circle cx={center} cy={center} r="14" fill="#ffffff" stroke="#dbeafe" strokeWidth="3" />

          <defs>
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8a6" />
              <stop offset="58%" stopColor="#ffbe2f" />
              <stop offset="100%" stopColor="#ff7e1d" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute right-0 top-[64px] z-20 rounded-[24px] bg-[radial-gradient(circle_at_top,_#9e66ff,_#5b2fc7)] px-3 py-2 text-center text-white shadow-[0_10px_28px_rgba(124,58,237,0.35)] sm:right-1 sm:top-[76px] sm:px-4 sm:py-3">
        <div className="flex justify-center">
          <Coins className="h-8 w-8 text-[#ffd54a] sm:h-10 sm:w-10" />
        </div>
        <div className="mt-1 text-[26px] font-black leading-none sm:text-[34px]">10,000</div>
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

      // Land on a Better Luck slice near the lower-right purple segment.
      setRotation((prev) => prev + 360 * 5 + 155);

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

      <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[34px] border border-white/80 bg-white px-4 py-6 shadow-[0_24px_80px_rgba(30,64,175,0.14)] dark:border-slate-800 dark:bg-slate-900 sm:px-8 sm:py-8"
        >
          <div className="mx-auto max-w-[560px] rounded-[34px] bg-gradient-to-b from-white to-[#f8fbff] px-4 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:from-slate-900 dark:to-slate-950 sm:px-8">
            <div className="mx-auto flex max-w-[360px] items-center justify-center rounded-full border border-[#cddff7] bg-[#e7f0ff] px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="text-[18px] font-extrabold text-[#2b5d9e] dark:text-cyan-300 sm:text-[20px]">
                Your Coins: {coins}
              </span>
              <Coins className="ml-2 h-7 w-7 text-[#ffbf1f]" />
            </div>

            <div className="mt-6 flex justify-center">
              <SpinWheel rotation={rotation} />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || !planPurchased}
              className="mt-8 w-full rounded-full bg-[linear-gradient(180deg,#27b5ff_0%,#204bff_100%)] px-6 py-4 text-xl font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.45),0_6px_0_#163cc4,0_16px_30px_rgba(37,99,235,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65 sm:text-[22px]"
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
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                Buy a plan first to unlock Spin & Earn.
              </div>
            ) : null}

            <div className="mt-6 border-t border-[#e4ecf7] pt-6 dark:border-slate-800">
              <div className="rounded-[24px] border border-[#dde7f4] bg-white px-5 py-5 shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900">
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
