import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { API } from '../services/api';
import toast from 'react-hot-toast';

type Plan = {
  name: string;
  icon: typeof Star;
  amount: number;
  period: string;
  duration: number;
  uploads: string;
  color: string;
  popular?: boolean;
  features: string[];
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const loadRazorpayScript = async () => {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Pricing() {
  const navigate = useNavigate();
  const [creatingPaymentFor, setCreatingPaymentFor] = useState<number | null>(null);

  const plans: Plan[] = [
    {
      name: '3 Months',
      icon: Star,
      amount: 99,
      period: '/plan',
      duration: 3,
      uploads: '3 bills/day',
      color: 'from-cyan-400 to-blue-600',
      features: [
        '3 uploads per day',
        'Scratch cards enabled',
        'Coin rewards',
        'Valid for 3 months',
      ],
    },
    {
      name: '6 Months',
      icon: Zap,
      amount: 159,
      period: '/plan',
      duration: 6,
      uploads: '3 bills/day',
      color: 'from-yellow-400 to-orange-500',
      popular: true,
      features: [
        '3 uploads per day',
        'Scratch cards enabled',
        'Coin rewards',
        'Valid for 6 months',
      ],
    },
    {
      name: '12 Months',
      icon: Crown,
      amount: 199,
      period: '/plan',
      duration: 12,
      uploads: '3 bills/day',
      color: 'from-purple-400 to-pink-600',
      features: [
        '3 uploads per day',
        'Scratch cards enabled',
        'Coin rewards',
        'Valid for 12 months',
      ],
    },
  ];

  const partners = [
    'Amazon', 'Flipkart', 'BigBasket', 'Swiggy', 'Zomato', 'DMart', 'Myntra', 'Paytm Mall'
  ];

  const handleCreatePayment = async (plan: Plan) => {
    try {
      setCreatingPaymentFor(plan.duration);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error('Failed to load Razorpay checkout');
        return;
      }

      const res = await API.post('/payment/create-order', {
        planDuration: plan.duration,
      });

      const checkout = new window.Razorpay({
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'DRAW BOXS',
        description: `${plan.name} plan activation`,
        order_id: res.data.orderId,
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled');
          },
        },
        handler: (response: RazorpayResponse) => {
          toast.success('Payment completed. Upload the screenshot now.');
          navigate(
            `/payment-upload?plan=${encodeURIComponent(plan.name)}&duration=${plan.duration}&amount=${plan.amount}&paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}`
          );
        },
      });

      checkout.open();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to start payment'
      );
    } finally {
      setCreatingPaymentFor(null);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="px-6 pt-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">Choose Your Plan</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Unlock higher earnings with premium plans
            </p>
          </motion.div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.duration}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hover
                  neonBorder={plan.popular}
                  className={`relative flex h-full flex-col p-8 ${
                    plan.popular ? 'scale-105 ring-2 ring-violet-500' : ''
                  }`}
                >
                  {plan.popular ? (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-2 font-bold text-white shadow-lg">
                      Most Popular
                    </div>
                  ) : null}

                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>

                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-5xl font-bold text-transparent dark:from-cyan-400 dark:to-violet-400">
                      {`₹${plan.amount}`}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                  </div>

                  <div className="mb-6 flex gap-3">
                    <div className="flex-1 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-3">
                      <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Daily Limit</div>
                      <div className="text-lg font-bold">{plan.uploads.split(' ')[0]}</div>
                    </div>
                  </div>

                  <ul className="mb-8 flex-grow space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <GlowButton
                    onClick={() => handleCreatePayment(plan)}
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="mb-3 w-full"
                    disabled={creatingPaymentFor === plan.duration}
                  >
                    {creatingPaymentFor === plan.duration ? 'Opening Payment...' : `Pay ₹${plan.amount}`}
                  </GlowButton>

                  <Link
                    to={`/payment-upload?plan=${encodeURIComponent(plan.name)}&duration=${plan.duration}&amount=${plan.amount}`}
                  >
                    <GlowButton
                      variant="outline"
                      className="w-full border-dashed"
                    >
                      Upload Payment Screenshot
                    </GlowButton>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <GlassCard className="p-8">
              <h2 className="mb-8 text-center text-3xl font-bold">
                Plan Comparison
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">3 Months</th>
                      <th className="px-6 py-4 text-center font-semibold">6 Months</th>
                      <th className="px-6 py-4 text-center font-semibold">12 Months</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4">Daily Upload Limit</td>
                      <td className="px-6 py-4 text-center">3 Bills</td>
                      <td className="px-6 py-4 text-center font-bold text-cyan-600 dark:text-violet-400">3 Bills</td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600 dark:text-pink-400">3 Bills</td>
                    </tr>

                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4">Plan Validity</td>
                      <td className="px-6 py-4 text-center">3 Months</td>
                      <td className="px-6 py-4 text-center">6 Months</td>
                      <td className="px-6 py-4 text-center">12 Months</td>
                    </tr>

                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4">Scratch Cards</td>
                      <td className="px-6 py-4 text-center">Enabled</td>
                      <td className="px-6 py-4 text-center">Enabled</td>
                      <td className="px-6 py-4 text-center">Enabled</td>
                    </tr>

                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4">Support</td>
                      <td className="px-6 py-4 text-center">Email Support</td>
                      <td className="px-6 py-4 text-center">Priority Support</td>
                      <td className="px-6 py-4 text-center">VIP Support</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <GlassCard className="p-8">
              <h3 className="mb-8 text-center text-2xl font-bold">
                Accepted Bills From Partner Platforms
              </h3>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {partners.map((partner, index) => (
                  <motion.div
                    key={partner}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="rounded-2xl border border-white/20 bg-white/40 p-6 text-center text-lg font-bold backdrop-blur-xl transition-transform hover:scale-105 dark:border-slate-700/50 dark:bg-slate-800/40"
                  >
                    {partner}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">How to Activate Your Plan</h3>
              <div className="mx-auto max-w-2xl space-y-4 text-slate-600 dark:text-slate-400">
                <p>1. Choose your preferred plan above</p>
                <p>2. Click the pay button to open a fresh Razorpay checkout for that plan</p>
                <p>3. Complete payment securely and keep the screenshot</p>
                <p>4. Upload payment screenshot on the next page</p>
                <p>5. Admin will verify and activate your plan within 24 hours</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
