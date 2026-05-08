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
  textAngle?: number;
};

const SPIN_DURATION_MS = 3200;
const SVG_SIZE = 420;
const CENTER = SVG_SIZE / 2;
const RADIUS = 182;
const SLICE_ANGLE = 45;

const slices: Slice[] = [
  { fill: '#f93d37', title: '2500', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#8a9dba', textAngle: 28 },
  { fill: '#156fe6', title: '1000', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#8a9dba', textAngle: -28 },
  { fill: '#6a38e6', title: 'Better Luck', textColor: '#ffffff' },
  { fill: '#ff880f', title: '3500', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#8a9dba', textAngle: -28 },
  { fill: '#5a2fd4', title: '5000', subtitle: 'Coins', textColor: '#ffffff' },
];

function polarPoint(radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function slicePath(startAngle: number, endAngle: number) {
  const start = polarPoint(RADIUS, endAngle);
  const end = polarPoint(RADIUS, startAngle);
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 0 ${end.x} ${end.y} Z`;
}

function Wheel({ rotation }: { rotation: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        height: 470,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 6,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '24px solid transparent',
          borderRight: '24px solid transparent',
          borderTop: '52px solid #f4c434',
          filter: 'drop-shadow(0 8px 12px rgba(214,153,18,0.35))',
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: 20,
          top: 98,
          zIndex: 3,
          borderRadius: 28,
          padding: '14px 18px',
          textAlign: 'center',
          color: '#fff',
          background: 'radial-gradient(circle at top, #b86dff 0%, #6f36e8 58%, #4725b4 100%)',
          boxShadow: '0 18px 28px rgba(111,54,232,0.30)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Coins size={38} color="#ffd54d" />
        </div>
        <div style={{ marginTop: 4, fontSize: 30, lineHeight: 1, fontWeight: 900 }}>10,000</div>
        <div style={{ fontSize: 14, fontWeight: 800 }}>Coins</div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: '18px 46px 0 46px',
          borderRadius: '999px',
          background: '#edf4ff',
          boxShadow: '0 18px 42px rgba(59,130,246,0.18)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: '28px 56px 10px 56px',
          borderRadius: '50%',
          border: '8px solid #c8daf3',
          background: '#fff',
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.16,0.84,0.24,1)`,
          overflow: 'hidden',
        }}
      >
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="spin-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe689" />
              <stop offset="58%" stopColor="#ffb320" />
              <stop offset="100%" stopColor="#ff7c19" />
            </radialGradient>
          </defs>

          {slices.map((slice, index) => {
            const startAngle = index * SLICE_ANGLE - 22.5;
            const endAngle = startAngle + SLICE_ANGLE;
            const midAngle = startAngle + SLICE_ANGLE / 2;
            const point = polarPoint(118, midAngle);
            const isBetter = slice.title === 'Better Luck';

            return (
              <g key={`${slice.title}-${index}`}>
                <path d={slicePath(startAngle, endAngle)} fill={slice.fill} stroke="#d6e4f6" strokeWidth="3" />
                <text
                  x={point.x}
                  y={point.y}
                  fill={slice.textColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="800"
                  fontSize={isBetter ? '20' : '30'}
                  transform={slice.textAngle ? `rotate(${slice.textAngle} ${point.x} ${point.y})` : undefined}
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

          <circle cx={CENTER} cy={CENTER} r="96" fill="url(#spin-core)" />
          <circle cx={CENTER} cy={CENTER} r="26" fill="#ffffff" stroke="#dbe8f8" strokeWidth="6" />
        </svg>
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
      <div style={{ minHeight: '100vh', background: '#eef5ff' }}>
        <Header />
        <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '4px solid #06b6d4',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef5ff', paddingBottom: 64 }}>
      <Header />

      <main style={{ padding: '32px 16px 0' }}>
        <section
          style={{
            maxWidth: 980,
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: 46,
            boxShadow: '0 30px 80px rgba(30,64,175,0.14)',
            padding: '36px 28px 42px',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div
              style={{
                maxWidth: 520,
                margin: '0 auto',
                borderRadius: 999,
                border: '1px solid #cfdef3',
                background: '#ddecff',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 900, color: '#2b5b97' }}>
                Your Coins: {coins}
              </span>
              <Coins size={34} color="#ffbe1a" style={{ marginLeft: 14 }} />
            </div>

            <div style={{ marginTop: 24 }}>
              <Wheel rotation={rotation} />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || !planPurchased}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: 600,
                margin: '-4px auto 0',
                border: 'none',
                borderRadius: 999,
                padding: '18px 24px',
                fontSize: 24,
                fontWeight: 900,
                color: '#ffffff',
                background: 'linear-gradient(180deg, #28b8ff 0%, #1f43ff 100%)',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.38), 0 7px 0 #173fca, 0 18px 28px rgba(37,99,235,0.24)',
                cursor: spinning || !planPurchased ? 'not-allowed' : 'pointer',
                opacity: spinning || !planPurchased ? 0.65 : 1,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <RotateCw size={28} className={spinning ? 'animate-spin' : ''} />
                {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
              </span>
            </button>

            <p
              style={{
                marginTop: 22,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 500,
                color: '#64789a',
              }}
            >
              Every spin costs {spinCost} coins. Results are final.
            </p>

            {!planPurchased ? (
              <div
                style={{
                  maxWidth: 620,
                  margin: '16px auto 0',
                  borderRadius: 18,
                  border: '1px solid #fcd34d',
                  background: '#fef3c7',
                  color: '#92400e',
                  textAlign: 'center',
                  padding: '12px 16px',
                  fontWeight: 700,
                }}
              >
                Buy a plan first to unlock Spin & Earn.
              </div>
            ) : null}

            <div
              style={{
                maxWidth: 720,
                margin: '28px auto 0',
                borderTop: '1px solid #e5edf8',
                paddingTop: 24,
              }}
            >
              <div
                style={{
                  borderRadius: 30,
                  border: '1px solid #e0e8f3',
                  background: '#ffffff',
                  padding: '20px 26px',
                  boxShadow: '0 14px 26px rgba(15,23,42,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div
                    style={{
                      width: 66,
                      height: 66,
                      borderRadius: '50%',
                      background: '#e9eff7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#70829d',
                      flexShrink: 0,
                    }}
                  >
                    <Frown size={36} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#314764' }}>
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
