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
const SVG_SIZE = 460;
const CENTER = SVG_SIZE / 2;
const RADIUS = 202;
const SLICE_ANGLE = 45;
const BETTER_LUCK_TARGET_ROTATION = 90;

const slices: Slice[] = [
  { fill: '#ff3d38', title: '2500', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#5d749b', textAngle: 28 },
  { fill: '#106be2', title: '1000', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#5d749b', textAngle: -28 },
  { fill: '#7b44ea', title: 'Better Luck', textColor: '#ffffff' },
  { fill: '#ff870e', title: '3500', subtitle: 'Coins', textColor: '#ffffff' },
  { fill: '#ffffff', title: 'Better Luck', textColor: '#5d749b', textAngle: -28 },
  { fill: '#5f35d7', title: '5000', subtitle: 'Coins', textColor: '#ffffff' },
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
        maxWidth: 650,
        height: 650,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 8,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '26px solid transparent',
          borderRight: '26px solid transparent',
          borderTop: '58px solid #f7c531',
          filter: 'drop-shadow(0 10px 14px rgba(214,153,18,0.34))',
          zIndex: 4,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 36,
          transform: 'translateX(-50%)',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: '#edf4ff',
          boxShadow: '0 22px 48px rgba(59,130,246,0.14)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 52,
          transform: `translateX(-50%) rotate(${rotation}deg)`,
          width: 528,
          height: 528,
          borderRadius: '50%',
          border: '8px solid #c8daf3',
          background: '#ffffff',
          transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.16,0.84,0.24,1)`,
          overflow: 'hidden',
        }}
      >
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="spin-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe98d" />
              <stop offset="58%" stopColor="#ffb322" />
              <stop offset="100%" stopColor="#ff7c19" />
            </radialGradient>
          </defs>

          {slices.map((slice, index) => {
            const startAngle = index * SLICE_ANGLE - 22.5;
            const endAngle = startAngle + SLICE_ANGLE;
            const midAngle = startAngle + SLICE_ANGLE / 2;
            const point = polarPoint(156, midAngle);
            const isBetter = slice.title === 'Better Luck';

            return (
              <g key={`${slice.title}-${index}`}>
                <path d={slicePath(startAngle, endAngle)} fill={slice.fill} stroke="#d9e6f8" strokeWidth="3" />
                <text
                  x={point.x}
                  y={point.y}
                  fill={slice.textColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="800"
                  fontSize={isBetter ? '18' : '28'}
                  style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
                  transform={slice.textAngle ? `rotate(${slice.textAngle} ${point.x} ${point.y})` : undefined}
                >
                  {isBetter ? (
                    <>
                      <tspan x={point.x} dy="-6">Better</tspan>
                      <tspan x={point.x} dy="20">Luck</tspan>
                    </>
                  ) : (
                    <>
                      <tspan x={point.x} dy="-5">{slice.title}</tspan>
                      <tspan x={point.x} dy="24">{slice.subtitle}</tspan>
                    </>
                  )}
                </text>
              </g>
            );
          })}

          <circle cx={CENTER} cy={CENTER} r="82" fill="url(#spin-core)" />
          <circle cx={CENTER} cy={CENTER} r="28" fill="#ffffff" stroke="#dce8f8" strokeWidth="6" />
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
  const [result, setResult] = useState('');
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    void fetchStatus();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    setHasSpun(false);
    setResult('');

    try {
      const res = await API.post('/spin/play');
      setCoins(res.data.coins ?? 0);
      setRotation((prev) => {
        const currentMod = prev % 360;
        const deltaToTarget =
          (BETTER_LUCK_TARGET_ROTATION - currentMod + 360) % 360;

        return prev + 360 * 5 + deltaToTarget;
      });

      window.setTimeout(() => {
        setResult(res.data.result || 'Better luck next time');
        setHasSpun(true);
        setSpinning(false);
      }, SPIN_DURATION_MS + 120);
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

  const cardMaxWidth = isMobile ? 680 : 860;
  const cardPadding = isMobile ? '30px 18px 36px' : '42px 26px 52px';
  const pillMaxWidth = isMobile ? 520 : 540;
  const pillPadding = isMobile ? '16px 18px' : '18px 24px';
  const coinFontSize = isMobile ? 24 : 28;
  const wheelWrapMaxWidth = isMobile ? 360 : 650;
  const wheelWrapHeight = isMobile ? 390 : 650;
  const wheelOuterSize = isMobile ? 360 : 560;
  const wheelInnerSize = isMobile ? 336 : 528;
  const wheelOuterTop = isMobile ? 30 : 36;
  const wheelInnerTop = isMobile ? 44 : 52;
  const wheelInsetSide = isMobile ? 12 : 0;
  const pointerTop = isMobile ? 10 : 8;
  const pointerSide = isMobile ? 18 : 26;
  const pointerHeight = isMobile ? 40 : 58;
  const badgeTop = isMobile ? 98 : 142;
  const badgeRight = isMobile ? -2 : 8;
  const badgePadding = isMobile ? '10px 14px 12px' : '12px 20px 14px';
  const badgeMainText = isMobile ? 28 : 40;
  const badgeSubText = isMobile ? 14 : 18;
  const buttonMaxWidth = isMobile ? 520 : 640;
  const buttonFontSize = isMobile ? 20 : 28;
  const buttonPadding = isMobile ? '18px 22px' : '22px 28px';
  const buttonMarginTop = isMobile ? '-4px' : '-12px';
  const helperTextSize = isMobile ? 14 : 18;
  const resultFontSize = isMobile ? 18 : 28;
  const resultIconSize = isMobile ? 32 : 40;
  const resultBoxPadding = isMobile ? '18px 22px' : '22px 34px';
  const resultGap = isMobile ? 14 : 20;
  const resultCircleSize = isMobile ? 58 : 70;

  return (
    <div style={{ minHeight: '100vh', background: '#eef5ff', paddingBottom: 64 }}>
      <Header />

      <main style={{ padding: isMobile ? '24px 10px 0' : '36px 16px 0' }}>
        <section
          style={{
            maxWidth: cardMaxWidth,
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: isMobile ? 36 : 54,
            boxShadow: '0 34px 80px rgba(30,64,175,0.12)',
            padding: cardPadding,
          }}
        >
          <div
            style={{
              maxWidth: pillMaxWidth,
              margin: '0 auto',
              borderRadius: 999,
              border: '1px solid #d5e3f7',
              background: '#d9e9fe',
              padding: pillPadding,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
            }}
          >
            <span style={{ fontSize: coinFontSize, fontWeight: 900, color: '#214f8f' }}>
              Your Coins: {coins}
            </span>
            <Coins size={isMobile ? 30 : 38} color="#ffbe1a" style={{ marginLeft: 12 }} />
          </div>

          <div
            style={{
              marginTop: isMobile ? 12 : 18,
              maxWidth: wheelWrapMaxWidth,
              marginInline: 'auto',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: wheelWrapMaxWidth,
                height: wheelWrapHeight,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: pointerTop,
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `${pointerSide}px solid transparent`,
                  borderRight: `${pointerSide}px solid transparent`,
                  borderTop: `${pointerHeight}px solid #f7c531`,
                  filter: 'drop-shadow(0 10px 14px rgba(214,153,18,0.34))',
                  zIndex: 4,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: wheelOuterTop,
                  transform: 'translateX(-50%)',
                  width: wheelOuterSize,
                  height: wheelOuterSize,
                  borderRadius: '50%',
                  background: '#edf4ff',
                  boxShadow: '0 22px 48px rgba(59,130,246,0.14)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: wheelInnerTop,
                  transform: `translateX(-50%) rotate(${rotation}deg)`,
                  width: wheelInnerSize,
                  height: wheelInnerSize,
                  borderRadius: '50%',
                  border: isMobile ? '6px solid #c8daf3' : '8px solid #c8daf3',
                  background: '#ffffff',
                  transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.16,0.84,0.24,1)`,
                  overflow: 'hidden',
                }}
              >
                <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <radialGradient id="spin-core" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffe98d" />
                      <stop offset="58%" stopColor="#ffb322" />
                      <stop offset="100%" stopColor="#ff7c19" />
                    </radialGradient>
                  </defs>

                  {slices.map((slice, index) => {
                    const startAngle = index * SLICE_ANGLE - 22.5;
                    const endAngle = startAngle + SLICE_ANGLE;
                    const midAngle = startAngle + SLICE_ANGLE / 2;
                    const point = polarPoint(isMobile ? 156 : 156, midAngle);
                    const isBetter = slice.title === 'Better Luck';

                    return (
                      <g key={`${slice.title}-${index}`}>
                        <path d={slicePath(startAngle, endAngle)} fill={slice.fill} stroke="#d9e6f8" strokeWidth="3" />
                        <text
                          x={point.x}
                          y={point.y}
                          fill={slice.textColor}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontWeight="800"
                          fontSize={isBetter ? (isMobile ? '16' : '18') : (isMobile ? '26' : '28')}
                          style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
                          transform={slice.textAngle ? `rotate(${slice.textAngle} ${point.x} ${point.y})` : undefined}
                        >
                          {isBetter ? (
                            <>
                              <tspan x={point.x} dy="-6">Better</tspan>
                              <tspan x={point.x} dy="20">Luck</tspan>
                            </>
                          ) : (
                            <>
                              <tspan x={point.x} dy="-5">{slice.title}</tspan>
                              <tspan x={point.x} dy="24">{slice.subtitle}</tspan>
                            </>
                          )}
                        </text>
                      </g>
                    );
                  })}

                  <circle cx={CENTER} cy={CENTER} r={isMobile ? 72 : 82} fill="url(#spin-core)" />
                  <circle cx={CENTER} cy={CENTER} r={isMobile ? 24 : 28} fill="#ffffff" stroke="#dce8f8" strokeWidth="6" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleSpin}
            disabled={spinning || !planPurchased}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: buttonMaxWidth,
              margin: `${buttonMarginTop} auto 0`,
              border: 'none',
              borderRadius: 999,
              padding: buttonPadding,
              fontSize: buttonFontSize,
              fontWeight: 900,
              color: '#ffffff',
              background: 'linear-gradient(180deg, #31beff 0%, #2244ff 100%)',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.36), 0 8px 0 #173fd0, 0 18px 24px rgba(37,99,235,0.22)',
              cursor: spinning || !planPurchased ? 'not-allowed' : 'pointer',
              opacity: spinning || !planPurchased ? 0.65 : 1,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <RotateCw size={isMobile ? 24 : 30} className={spinning ? 'animate-spin' : ''} />
              {spinning ? 'Spinning...' : `Start Spin - ${spinCost} Coins`}
            </span>
          </button>

          <p
            style={{
              marginTop: isMobile ? 18 : 26,
              textAlign: 'center',
              fontSize: helperTextSize,
              fontWeight: 700,
              color: '#506b94',
              paddingInline: isMobile ? 12 : 0,
            }}
          >
            Every spin costs {spinCost} coins. Results are final.
          </p>

          {!planPurchased ? (
            <div
              style={{
                maxWidth: 640,
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

          {hasSpun && !spinning ? (
            <div
              style={{
                maxWidth: 760,
                margin: isMobile ? '24px auto 0' : '34px auto 0',
                borderTop: '1px solid #e6edf8',
                paddingTop: isMobile ? 20 : 28,
              }}
            >
              <div
                style={{
                  borderRadius: isMobile ? 24 : 32,
                  border: '1px solid #e3eaf4',
                  background: '#ffffff',
                  padding: resultBoxPadding,
                  boxShadow: '0 16px 24px rgba(15,23,42,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: resultGap }}>
                  <div
                    style={{
                      width: resultCircleSize,
                      height: resultCircleSize,
                      borderRadius: '50%',
                      background: '#e8eef7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#70829d',
                      flexShrink: 0,
                    }}
                  >
                    <Frown size={resultIconSize} />
                  </div>
                  <div style={{ fontSize: resultFontSize, fontWeight: 900, color: '#304764' }}>
                    {result}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
