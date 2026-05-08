import { useEffect, useState } from 'react';
import { Coins, RotateCw, Frown } from 'lucide-react';
import Header from '../components/Header';
import { API } from '../services/api';
import toast from 'react-hot-toast';

type Slice = {
  fill: string;
  title: string;
  subtitle?: string;
  textColor: string;
  rotate?: number;
};

const SPIN_DURATION_MS = 3200;
const SIZE = 420;
const CENTER = SIZE / 2;
const RADIUS = 182;
const SLICE_ANGLE = 45;

const slices: Slice[] = [
  { fill: '#f93d37', title: '2500', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#8da0bb', rotate: 26 },
  { fill: '#156fe6', title: '1000', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#8da0bb', rotate: -24 },
  { fill: '#6c39e6', title: 'Better Luck', textColor: '#ffffff' },
  { fill: '#ff880f', title: '3500', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#8da0bb', rotate: -28 },
  { fill: '#5a2ed1', title: '5000', subtitle: 'Coins', textColor: '#ffffff' },
];

function polarToCartesian(radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function buildSlicePath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(RADIUS, endAngle);
  const end = polarToCartesian(RADIUS, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function SpinWheel({ rotation }: { rotation: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="pointer-events-none absolute left-1/2 top-[8px] z-20 -translate-x-1/2">
        <div
          className="h-0 w-0 border-l-[22px] border-r-[22px] border-t-[48px] border-l-transparent border-r-transparent border-t-[#f6c02c] drop-shadow-[0_10px_18px_rgba(214,153,18,0.42)]"
        />
      </div>

      <div
        className="absolute right-[-8px] top-[66px] z-20 rounded-[28px] px-4 py-3 text-center text-white shadow-[0_18px_30px_rgba(113,63,194,0.35)]"
        style={{ background: 'radial-gradient(circle at top, #b86dff 0%, #6f36e8 55%, #4925b6 100%)' }}
      >
        <div className="flex justify-center">
          <Coins className="h-10 w-10 text-[#ffd64d]" />
        </div>
        <div className="mt-1 text-[30px] font-black leading-none">10,000</div>
        <div className="text-sm font-bold">Coins</div>
      </div>

      <div className="relative h-[460px]">
        <div className="absolute inset-x-0 top-0 mx-auto h-[420px] w-[420px] rounded-full bg-[#edf4ff] shadow-[0_18px_48px_rgba(59,130,246,0.18)]" />

        <div
          className="absolute inset-x-0 top-[10px] mx-auto h-[400px] w-[400px] rounded-full border-[6px] border-[#c7daf5] bg-white"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.16,0.84,0.24,1)`,
          }}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full rounded-full">
            <defs>
              <radialGradient id="spin-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffe688" />
                <stop offset="58%" stopColor="#ffb31f" />
                <stop offset="100%" stopColor="#ff7e18" />
              </radialGradient>
            </defs>

            {slices.map((slice, index) => {
              const startAngle = index * SLICE_ANGLE - 22.5;
              const endAngle = startAngle + SLICE_ANGLE;
              const midAngle = startAngle + SLICE_ANGLE / 2;
              const point = polarToCartesian(120, midAngle);
              const textRotate = slice.rotate ?? 0;
              const isBetter = slice.title === 'Better Luck';

              return (
                <g key={`${slice.title}-${index}`}>
                  <path
                    d={buildSlicePath(startAngle, endAngle)}
                    fill={slice.fill}
                    stroke="#d7e5f8"
                    strokeWidth="3"
                  />
                  <text
                    x={point.x}
                    y={point.y}
                    fill={slice.textColor}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight="800"
                    fontSize={isBetter ? '20' : '30'}
                    transform={textRotate ? `rotate(${textRotate} ${point.x} ${point.y})` : undefined}
                  >
                    {isBetter ? (
                      <>
                        <tspan x={point.x} dy="-8">Better</tspan>
                        <tspan x={point.x} dy="24">Luck</tspan>
                      </>
                    ) : (
                      <>
                        <tspan x={point.x} dy="-6">{slice.title}</tspan>
                        <tspan x={point.x} dy="28">{slice.subtitle}</tspan>
                      </>
                    )}
                  </text>
                </g>
              );
            })}

            <circle cx={CENTER} cy={CENTER} r="94" fill="url(#spin-gold)" opacity="0.96" />
            <circle cx={CENTER} cy={CENTER} r="26" fill="#ffffff" stroke="#dce8f8" strokeWidth="6" />
          </svg>
        </div>
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
      setRotation((prev) => prev + 360 * 5 + 22.5);

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

      <main className="px-4 pt-8 sm:px-6">
        <section className="mx-auto max-w-[940px] rounded-[46px] bg-white px-4 py-8 shadow-[0_30px_80px_rgba(30,64,175,0.14)] dark:bg-[#0f172a] sm:px-10 sm:py-10">
          <div className="mx-auto max-w-[760px]">
            <div className="mx-auto flex max-w-[520px] items-center justify-center rounded-full border border-[#cfe0f5] bg-[#ddecff] px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-[#182744]">
              <span className="text-[18px] font-black text-[#2b5b97] dark:text-[#a8d0ff] sm:text-[24px]">
                Your Coins: {coins}
              </span>
              <Coins className="ml-3 h-8 w-8 text-[#ffbe1a]" />
            </div>

            <div className="mt-8">
              <SpinWheel rotation={rotation} />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || !planPurchased}
              className="mx-auto mt-2 block w-full max-w-[620px] rounded-full px-6 py-5 text-[28px] font-black text-white shadow-[inset_0_4px_0_rgba(255,255,255,0.38),0_7px_0_#173fca,0_18px_28px_rgba(37,99,235,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65"
              style={{ background: 'linear-gradient(180deg, #28b8ff 0%, #1f43ff 100%)' }}
            >
              <span className="inline-flex items-center gap-3">
                <RotateCw className={`h-7 w-7 ${spinning ? 'animate-spin' : ''}`} />
                {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
              </span>
            </button>

            <p className="mt-5 text-center text-[18px] font-medium text-[#64789a] dark:text-slate-400">
              Every spin costs {spinCost} coins. Results are final.
            </p>

            {!planPurchased ? (
              <div className="mx-auto mt-4 max-w-[620px] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Buy a plan first to unlock Spin & Earn.
              </div>
            ) : null}

            <div className="mx-auto mt-8 max-w-[760px] border-t border-[#e5edf8] pt-8 dark:border-slate-800">
              <div className="rounded-[30px] border border-[#e0e8f3] bg-white px-8 py-6 shadow-[0_14px_26px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-[#10192c]">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9eff7] text-[#70829d] dark:bg-slate-800 dark:text-slate-300">
                    <Frown className="h-9 w-9" />
                  </div>
                  <div className="text-[26px] font-black text-[#314764] dark:text-white">
                    {result}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
