import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Upload,
  Sparkles,
  Coins,
  Wallet,
  Shield,
  Zap,
  TrendingUp,
  Users,
  ChevronDown,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API } from '../services/api';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast.error("Please fill in the required fields");
      return;
    }

    setSendingMessage(true);
    const toastId = toast.loading("Sending message...");
    try {
      await API.post("/contact/submit", contactData);
      toast.dismiss(toastId);
      toast.success("Message sent successfully!");
      setContactData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.dismiss(toastId);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to send message. Please try again later."
        : "Failed to send message. Please try again later.";
      toast.error(message);
    } finally {
      setSendingMessage(false);
    }
  };

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Simply upload your bills and receipts in seconds',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your data is encrypted and protected',
    },
    {
      icon: Zap,
      title: 'Instant Rewards',
      description: 'Get coins immediately after verification',
    },
    {
      icon: TrendingUp,
      title: 'Growing Returns',
      description: 'Unlock higher multipliers with premium plans',
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: 'Upload Bills',
      description: 'Upload your shopping bills or receipts',
      color: 'from-blue-400 to-cyan-600',
    },
    {
      icon: Sparkles,
      title: 'Scratch Card',
      description: 'Get scratch cards for each upload',
      color: 'from-purple-400 to-pink-600',
    },
    {
      icon: Coins,
      title: 'Earn Coins',
      description: 'Win coins from scratch cards',
      color: 'from-yellow-400 to-orange-600',
    },
    {
      icon: Wallet,
      title: 'Withdraw',
      description: 'Convert coins to money and withdraw',
      color: 'from-green-400 to-emerald-600',
    },
  ];

  const plans = [
  {
    name: "3 Months",
    price: "₹99",
    period: "/plan",
    duration: 3,
    uploads: "3 bills/day",
    razorpayLink: "https://rzp.io/rzp/JJ11TXZ",
    color: "from-cyan-400 to-blue-600",
    features: [
      "3 uploads per day",
      "Scratch cards enabled",
      "Coin rewards",
      "Valid for 3 months",
    ],
  },
  {
    name: "6 Months",
    icon: Zap,
    price: "₹159",
    period: "/plan",
    duration: 6,
    uploads: "3 bills/day",
    razorpayLink: "https://rzp.io/rzp/OoBrREt",
    color: "from-yellow-400 to-orange-500",
    popular: true,
    features: [
      "3 uploads per day",
      "Scratch cards enabled",
      "Coin rewards",
      "Valid for 6 months",
    ],
  },
  {
    name: "12 Months",
    price: "₹199",
    period: "/plan",
    duration: 12,
    uploads: "3 bills/day",
    razorpayLink: "https://rzp.io/rzp/mUmctex",
    color: "from-purple-400 to-pink-600",
    features: [
      "3 uploads per day",
      "Scratch cards enabled",
      "Coin rewards",
      "Valid for 12 months",
    ],
  },
];

  const faqs = [
    {
      question: 'How do I earn coins?',
      answer: 'Upload your bills, scratch cards to reveal coins, and accumulate them in your wallet.',
    },
    {
      question: 'What bills can I upload?',
      answer: 'Any shopping bills, receipts, or invoices from retail stores, restaurants, or online purchases.',
    },
    {
      question: 'How do I withdraw my earnings?',
      answer: 'Once you reach the minimum threshold, request a withdrawal and receive money directly to your bank account.',
    },
    {
      question: 'Are there daily limits?',
      answer: 'Yes, limits depend on your plan. Silver: 5/day, Gold: 15/day, Platinum: 50/day.',
    },
  ];

  const partners = [
    'Amazon', 'Flipkart', 'BigBasket', 'Swiggy', 'Zomato', 'DMart'
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 px-6 py-2 rounded-full backdrop-blur-xl bg-white/60 dark:bg-slate-900/40 border border-white/20 dark:border-slate-700/50">
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                ✨ Turn Your Bills Into Cash
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight">
              Drawboxs
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Earn Coins by Uploading Bills
            </p>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              Upload your shopping bills, scratch exciting cards, earn coins, and withdraw real money. Join thousands of users earning daily!
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <GlowButton variant="primary">Get Started Free</GlowButton>
              </Link>
              <Link to="/pricing">
                <GlowButton variant="outline">View Plans</GlowButton>
              </Link>
            </div>

            {/* Floating coin animation */}
            <motion.div
              className="mt-16 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${Math.sin(i) * 30}px`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                >
                  <Coins className="w-6 h-6 text-white m-auto mt-3" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-32"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 mx-auto text-slate-400" />
        </motion.div>
      </section>

      {/* Spin Promo */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="relative overflow-hidden p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.16),_transparent_28%)]" />

              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur-xl dark:bg-slate-900/60 dark:text-cyan-300">
                    <Sparkles className="w-4 h-4" />
                    New Feature
                  </div>

                  <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-[1.05]">
                    Spin & Earn
                    <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-violet-400">
                      Extra Coins Every Day
                    </span>
                  </h2>

                  <p className="mt-4 max-w-xl text-base md:text-lg leading-8 text-slate-600 dark:text-slate-300">
                    Premium users can use their coins to spin the wheel and unlock extra excitement inside Drawboxs.
                    It is fast, fun, and built to keep users engaged after every upload.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/spin">
                      <GlowButton variant="primary">Try Spin Now</GlowButton>
                    </Link>
                    <Link to="/pricing">
                      <GlowButton variant="outline">View Plans</GlowButton>
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      'Animated spin wheel',
                      'Extra coin attraction',
                      'Premium-only feature',
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/55 dark:text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[400px]">
                  <motion.div
                    className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-cyan-400/20 via-blue-300/10 to-violet-500/20 blur-2xl"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <div className="relative rounded-[34px] border border-white/40 bg-white/85 p-5 shadow-[0_24px_60px_rgba(56,189,248,0.16)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/65">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full border border-[#c7dcf7] bg-[#d8e8fc] px-6 py-3 text-base font-black text-[#214b88] shadow-[inset_0_2px_0_rgba(255,255,255,0.55)]">
                        Your Coins: 120
                      </div>
                    </div>

                    <div className="relative mx-auto h-[280px] w-[280px] sm:h-[320px] sm:w-[320px]">
                      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                        <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[46px] border-l-transparent border-r-transparent border-t-[#f6c533] drop-shadow-[0_8px_10px_rgba(246,197,51,0.25)]" />
                      </div>

                      <div className="absolute inset-0 rounded-full bg-[#eef5ff] shadow-[0_22px_32px_rgba(148,163,184,0.18)]" />
                      <div className="absolute inset-[10px] rounded-full border-[6px] border-[#c8daf4] bg-white" />

                      <motion.div
                        className="absolute inset-[20px] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        style={{
                          background:
                            'conic-gradient(from -22.5deg, #ff403b 0deg 45deg, #ffffff 45deg 90deg, #1674e8 90deg 135deg, #ffffff 135deg 180deg, #7f46ea 180deg 225deg, #ff8a11 225deg 270deg, #ffffff 270deg 315deg, #5f35d7 315deg 360deg)',
                        }}
                      >
                        {[
                          { text: '2500\nCoins', angle: 22.5, color: 'text-white', weight: 'font-black' },
                          { text: 'Better\nLuck', angle: 67.5, color: 'text-slate-500', weight: 'font-bold' },
                          { text: '1000\nCoins', angle: 112.5, color: 'text-white', weight: 'font-black' },
                          { text: 'Better\nLuck', angle: 157.5, color: 'text-slate-500', weight: 'font-bold' },
                          { text: 'Better\nLuck', angle: 202.5, color: 'text-white', weight: 'font-black' },
                          { text: '3500\nCoins', angle: 247.5, color: 'text-white', weight: 'font-black' },
                          { text: 'Better\nLuck', angle: 292.5, color: 'text-slate-500', weight: 'font-bold' },
                          { text: '5000\nCoins', angle: 337.5, color: 'text-white', weight: 'font-black' },
                        ].map((item) => (
                          <div
                            key={`${item.text}-${item.angle}`}
                            className={`absolute left-1/2 top-1/2 text-center text-[13px] sm:text-[15px] leading-[1.05] ${item.color} ${item.weight}`}
                            style={{
                              transform: `translate(-50%, -50%) rotate(${item.angle}deg) translateY(-102px) rotate(${-item.angle}deg)`,
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </motion.div>

                      <div className="absolute left-1/2 top-1/2 h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_#ffe88b_0%,_#ffbe2d_54%,_#ff8415_100%)] shadow-[0_12px_24px_rgba(255,145,30,0.3)]" />
                      <div className="absolute left-1/2 top-1/2 h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-[#dbe7f8] bg-white" />

                      <motion.div
                        className="absolute right-[-8px] top-[58px] rounded-[24px] bg-gradient-to-b from-[#8f4eff] to-[#5a2ad8] px-4 py-3 text-center text-white shadow-[0_18px_28px_rgba(115,70,236,0.26)]"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="text-[13px] font-semibold tracking-wide">Win up to</div>
                        <div className="text-[28px] font-black leading-none">10,000</div>
                        <div className="text-[15px] font-semibold">Coins</div>
                      </motion.div>
                    </div>

                    <div className="mt-6 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-700 px-5 py-4 text-center text-xl font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.35),0_6px_0_#1d39d2,0_16px_26px_rgba(37,99,235,0.24)]">
                      Start Spin
                    </div>

                    <div className="mt-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                      Every spin costs 3 coins. Results are final.
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Four simple steps to start earning</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-8 text-center h-full">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="mb-4 text-4xl font-bold text-slate-300 dark:text-slate-700">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Drawboxs?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Premium features for maximum earnings</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover neonBorder className="p-8 text-center">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-cyan-600 dark:text-violet-400" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Unlock higher earnings with premium plans</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hover
                  neonBorder={plan.popular}
                  className={`p-8 relative ${plan.popular ? 'ring-2 ring-violet-500' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold rounded-full">
                      Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                    {plan.price}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                     Coin Multiplier • {plan.uploads}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing">
                    <GlowButton variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                      Choose Plan
                    </GlowButton>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* Partners */}
<section className="py-20 px-6 overflow-hidden">
  <div className="max-w-7xl mx-auto text-center">

    {/* Heading */}
    <h3 className="text-xl text-slate-600 dark:text-slate-400 mb-12">
      Trusted by users from
    </h3>

    {/* Slider Wrapper */}
    <div className="relative w-full overflow-hidden">

      {/* Moving Row */}
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
        }}
      >

        {/* Duplicate for seamless loop */}
        {[...partners, ...partners].map((partner, index) => (

          <div
            key={index}
            className="
              px-8 py-4
              rounded-2xl
              backdrop-blur-xl
              bg-white/40 dark:bg-slate-800/40
              border border-white/20 dark:border-slate-700/50
              shadow-lg
              text-lg font-bold
              whitespace-nowrap
              bg-gradient-to-r
              from-cyan-500 via-violet-500 to-pink-500
              bg-clip-text text-transparent
            "
          >
            {partner}
          </div>

        ))}

      </motion.div>

    </div>

  </div>
</section>



      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Say</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Join thousands of happy earners</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Gold Member',
                text: 'I earn extra money just by uploading my grocery bills. Amazing concept!',
              },
              {
                name: 'Rahul Verma',
                role: 'Platinum Member',
                text: 'I have earned over ₹5000 in just a month!',
              },
              {
                name: 'Sneha Patel',
                role: 'Silver Member',
                text: 'Simple and easy to use. The scratch cards make it fun!',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{testimonial.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <span className="font-bold text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Let's discuss your next project or opportunity</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 h-full">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/10 dark:border-slate-700/50">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <a
                        href="mailto:drawboxs8@gmail.com"
                        className="font-medium text-slate-800 transition-colors hover:text-cyan-600 dark:text-slate-200 dark:hover:text-cyan-400"
                      >
                        drawboxs8@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/10 dark:border-slate-700/50">
                      <MapPin className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Location</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">Hyderabad, India</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/10 dark:border-slate-700/50">
                      <Phone className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Phone</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">Available on request</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-slate-300 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
                  />
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-slate-300 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
                  />
                  <input
                    type="text"
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-slate-300 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
                  />
                  <textarea
                    required
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-slate-300 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500 resize-none"
                  ></textarea>
                  <GlowButton type="submit" disabled={sendingMessage} className="w-full flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </GlowButton>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard neonBorder className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Join Drawboxs today and turn your bills into cash
              </p>
              <Link to="/register">
                <GlowButton variant="primary">Get Started Now</GlowButton>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Drawboxs</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Earn coins by uploading bills
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/pricing" className="hover:text-cyan-600">Pricing</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-600">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-cyan-600">About</a></li>
                <li><a href="#" className="hover:text-cyan-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/privacy-policy" className="hover:text-cyan-600">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-cyan-600">Terms & Conditions</Link></li>
                <li><Link to="/disclaimer" className="hover:text-cyan-600">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            © 2026 Drawboxs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
