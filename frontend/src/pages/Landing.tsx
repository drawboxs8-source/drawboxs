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
} from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState } from 'react';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    name: "6 Months",
    price: "₹99",
    period: "/plan",
    duration: 6,
    uploads: "3 bills/day",
    razorpayLink: "https://rzp.io/rzp/JJ11TXZ",
    color: "from-cyan-400 to-blue-600",
    features: [
      "3 uploads per day",
      "Scratch cards enabled",
      "Coin rewards",
      "Valid for 6 months",
    ],
  },
  {
    name: "12 Months",
    icon: Zap,
    price: "₹159",
    period: "/plan",
    duration: 12,
    uploads: "3 bills/day",
    razorpayLink: "https://rzp.io/rzp/OoBrREt",
    color: "from-yellow-400 to-orange-500",
    popular: true,
    features: [
      "3 uploads per day",
      "Scratch cards enabled",
      "Coin rewards",
      "Valid for 12 months",
    ],
  },
  {
    name: "20 Months",
    price: "₹199",
    period: "/plan",
    duration: 20,
    uploads: "3 bills/day",
    razorpayLink: "https://rzp.io/rzp/mUmctex",
    color: "from-purple-400 to-pink-600",
    features: [
      "3 uploads per day",
      "Scratch cards enabled",
      "Coin rewards",
      "Valid for 20 months",
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
