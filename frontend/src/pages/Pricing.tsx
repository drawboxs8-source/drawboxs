import { motion } from 'motion/react';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

export default function Pricing() {
  const plans = [
  {
    name: "3 Months",
    icon: Star,
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
    icon: Crown,
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


  const partners = [
    'Amazon', 'Flipkart', 'BigBasket', 'Swiggy', 'Zomato', 'DMart', 'Myntra', 'Paytm Mall'
  ];

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="pt-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Unlock higher earnings with premium plans
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hover
                  neonBorder={plan.popular}
                  className={`p-8 relative h-full flex flex-col ${
                    plan.popular ? 'ring-2 ring-violet-500 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                  </div>

                  {/* Highlights */}
                  <div className="flex gap-3 mb-6">
                    <div className="flex-1 p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Daily Limit</div>
                      <div className="text-lg font-bold">{plan.uploads.split(' ')[0]}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
{/* Pay Button */}
<a
  href={plan.razorpayLink}
  target="_blank"
  rel="noopener noreferrer"
  className="block mb-3"
>
  <GlowButton
    variant={plan.popular ? 'primary' : 'outline'}
    className="w-full"
  >
    Pay {plan.price}
  </GlowButton>
</a>

{/* Upload Screenshot Button */}
<Link to={`/payment-upload?plan=${encodeURIComponent(plan.name)}&duration=${plan.duration}&amount=${plan.price.replace('₹', '')}`}>
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

          {/* Comparison Table */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mb-16"
>
  <GlassCard className="p-8">
    <h2 className="text-3xl font-bold mb-8 text-center">
      Plan Comparison
    </h2>

    <div className="overflow-x-auto">
      <table className="w-full">

        {/* Table Head */}
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-4 px-6 font-semibold">
              Feature
            </th>
            <th className="text-center py-4 px-6 font-semibold">
              3 Months
            </th>
            <th className="text-center py-4 px-6 font-semibold">
              6 Months
            </th>
            <th className="text-center py-4 px-6 font-semibold">
              12 Months
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>

          {/* Upload Limit */}
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className="py-4 px-6">
              Daily Upload Limit
            </td>
            <td className="text-center py-4 px-6">
              3 Bills
            </td>
            <td className="text-center py-4 px-6 font-bold text-cyan-600 dark:text-violet-400">
              3 Bills
            </td>
            <td className="text-center py-4 px-6 font-bold text-purple-600 dark:text-pink-400">
              3 Bills
            </td>
          </tr>

          {/* Validity */}
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className="py-4 px-6">
              Plan Validity
            </td>
            <td className="text-center py-4 px-6">
              3 Months
            </td>
            <td className="text-center py-4 px-6">
              6 Months
            </td>
            <td className="text-center py-4 px-6">
              12 Months
            </td>
          </tr>

          {/* Scratch Cards */}
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className="py-4 px-6">
              Scratch Cards
            </td>
            <td className="text-center py-4 px-6">
              Enabled
            </td>
            <td className="text-center py-4 px-6">
              Enabled
            </td>
            <td className="text-center py-4 px-6">
              Enabled
            </td>
          </tr>


          {/* Support */}
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className="py-4 px-6">
              Support
            </td>
            <td className="text-center py-4 px-6">
              Email Support
            </td>
            <td className="text-center py-4 px-6">
              Priority Support
            </td>
            <td className="text-center py-4 px-6">
              VIP Support
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </GlassCard>
</motion.div>


          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold mb-8 text-center">
  Accepted Bills From Partner Platforms
</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {partners.map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 text-center font-bold text-lg hover:scale-105 transition-transform"
                  >
                    {partner}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">How to Activate Your Plan</h3>
              <div className="max-w-2xl mx-auto space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  1. Choose your preferred plan above
                </p>
               <p>
  2. Complete payment securely via Razorpay using the selected plan link
</p>

                <p>
                  3. Upload payment screenshot on the next page
                </p>
                <p>
                  4. Admin will verify and activate your plan within 24 hours
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
