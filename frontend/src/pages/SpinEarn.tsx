import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Coins, RotateCw, Frown } from 'lucide-react';
import Header from '../components/Header';
import { API } from '../services/api';
import toast from 'react-hot-toast';

type Slice = {
  fill: string;
  text: string[];
  textColor: string;
};

const SPIN_DURATION_MS = 3200;
const WHEEL_SIZE = 440;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 190;
const SLICE_ANGLE = 360 / 8;

const slices: Slice[] = [
  { fill: '#ef4444', text: ['2500', 'Coins'], textColor: '#ffffff' },
  { fill: '#f7fbff', text: ['Better', 'Luck'], textColor: '#8da0bb' },
  { fill: '#176ee6', text: ['1000', 'Coins'], textColor: '#ffffff' },
  { fill: '#f7fbff', text: ['Better', 'Luck'], textColor: '#8da0bb' },
  { fill: '#6f39e6', text: ['Better', 'Luck'], textColor: '#ffffff' },
  { fill: '#ff8b17', text: ['3500', 'Coins'], textColor: '#ffffff' },
  { fill: '#f7fbff', text: ['Better', 'Luck'], textColor: '#8da0bb' },
  { fill: '#5630d1', text: ['5000', 'Coins'], textColor: '#ffffff' },
];

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeSlice(startAngle: number, endAngle: number) {
  const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function WheelSvg({ rotation }: { rotation: number }) {
  return (
    <div className="relative mx-auto h-[340px] w-[340px] sm:h-[560px] sm:w-[560px]">
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <div className="h-0 w-0 border-l-[20px] border-r-[20px] border-t-[44px] border-l-transparent border-r-transparent border-t-[#f8c52f] drop-shadow-[0_8px_12px_rgba(245,158,11,0.35)] sm:border-l-[24px] sm:border-r-[24px] sm:border-t-[54px]" />
      </div>

      <div className="absolute inset-[18px] rounded-full bg-[#edf5ff] shadow-[0_18px_44px_rgba(37,99,235,0.22)] sm:inset-[32px]" />

      <motion.div
        className="absolute inset-[30px] rounded-full border-[6px] border-[#c3d8f4] bg-white sm:inset-[42px] sm:border-[8px]"
        animate={{ rotate: rotation }}
        transition={{
          duration: SPIN_DURATION_MS / 1000,
          ease: [0.16, 0.84, 0.24, 1],
        }}
      >
        <svg
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          className="h-full w-full rounded-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="spin-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe17b" />
              <stop offset="60%" stopColor="#ffb41f" />
              <stop offset="100%" stopColor="#f87f1b" />
            </radialGradient>
          </defs>

          {slices.map((slice, index) => {
            const startAngle = index * SLICE_ANGLE - 22.5;
            const endAngle = startAngle + SLICE_ANGLE;
            const midAngle = startAngle + SLICE_ANGLE / 2;
            const point = polarToCartesian(CENTER, CENTER, 118, midAngle);

            return (
              <g key={`${slice.text.join('-')}-${index}`}>
                <path d={describeSlice(startAngle, endAngle)} fill={slice.fill} stroke="#d9e8fb" strokeWidth="4" />
                <text
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={slice.textColor}
                  fontWeight="800"
                  fontSize={slice.text[0] === 'Better' ? 22 : 32}
                >
                  {slice.text.map((line, lineIndex) => (
                    <tspan
                      key={`${line}-${lineIndex}`}
                      x={point.x}
                      dy={lineIndex === 0 ? 0 : 28}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          <circle cx={CENTER} cy={CENTER} r="88" fill="url(#spin-core)" />
          <circle cx={CENTER} cy={CENTER} r="24" fill="#ffffff" stroke="#dbeafe" strokeWidth="6" />
        </svg>
      </motion.div>

      <div className="absolute right-[-2px] top-[78px] z-20 rounded-[28px] border border-[#9d77ff] px-3 py-3 text-center text-white shadow-[0_14px_28px_rgba(109,59,227,0.35)] sm:right-[24px] sm:top-[122px] sm:px-4 sm:py-4"
        style={{ background: 'radial-gradient(circle at top, #a56aff 0%, #6d3be3 58%, #4924b5 100%)' }}
      >
        <div className="flex justify-center">
          <Coins className="h-8 w-8 text-[#ffd54a] sm:h-10 sm:w-10" />
        </div>
        <div className="mt-1 text-[24px] font-black leading-none sm:text-[34px]">10,000</div>
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
    void fetchStatus();
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
      setRotation((prev) => prev + 360 * 5 + 45);

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
    <div className="min-h-screen bg-[#eef5ff] pb-16 text-slate-900 dark:bg-[#0b1020] dark:text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[40px] bg-white px-4 py-6 shadow-[0_24px_80px_rgba(30,64,175,0.14)] dark:bg-[#0f172a] sm:px-8 sm:py-8"
        >
          <div className="mx-auto max-w-[860px] rounded-[44px] bg-[#fcfdff] px-4 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:bg-[#111c34] sm:px-10 sm:py-10">
            <div className="mx-auto flex max-w-[460px] items-center justify-center rounded-full border border-[#cfddf1] bg-[#dcebff] px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-[#162844]">
              <span className="text-[18px] font-black text-[#27538e] dark:text-[#9dccff] sm:text-[20px]">
                Your Coins: {coins}
              </span>
              <Coins className="ml-2 h-7 w-7 text-[#ffbf1f]" />
            </div>

            <div className="mt-8 flex justify-center sm:mt-10">
              <WheelSvg rotation={rotation} />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || !planPurchased}
              className="mx-auto -mt-2 block w-full max-w-[620px] rounded-full px-6 py-4 text-xl font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.42),0_6px_0_#163cc4,0_16px_30px_rgba(37,99,235,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65 sm:mt-0 sm:text-[22px]"
              style={{ background: 'linear-gradient(180deg, #27b5ff 0%, #204bff 100%)' }}
            >
              <span className="inline-flex items-center gap-3">
                <RotateCw className={`h-6 w-6 ${spinning ? 'animate-spin' : ''}`} />
                {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
              </span>
            </button>

            <p className="mt-5 text-center text-sm font-medium text-[#687a96] dark:text-slate-400 sm:text-[18px]">
              Every spin costs {spinCost} coins. Results are final.
            </p>

            {!planPurchased ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Buy a plan first to unlock Spin & Earn.
              </div>
            ) : null}

            <div className="mx-auto mt-8 max-w-[700px] border-t border-[#e5edf8] pt-6 dark:border-slate-800">
              <div className="rounded-[28px] border border-[#dde7f4] bg-white px-5 py-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-[#0f172a] sm:px-8 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2f8] text-[#7385a1] dark:bg-slate-800 dark:text-slate-300">
                    <Frown className="h-9 w-9" />
                  </div>
                  <div className="text-[22px] font-black text-[#334a68] dark:text-white sm:text-[28px]">
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
