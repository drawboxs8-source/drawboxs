import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState } from 'react';
import { API } from "../services/api";
import { Eye, EyeOff } from "lucide-react";



export default function Register() {
  const [showApproval, setShowApproval] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  referralCode: new URLSearchParams(window.location.search).get("ref") || ""
});
const handleChange = (e: any) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await API.post("/auth/register", formData);

    setShowApproval(true);

  } catch (error) {
    console.log(error);
    alert("Registration Failed");
  }
};


  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard neonBorder className="p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Account</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Join Drawboxs and start earning coins today
                </p>

                {showApproval ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                      <motion.svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Registration Successful!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Your account is pending admin approval. You'll receive an email notification once your account is activated.
                    </p>
                    <Link to="/">
                      <GlowButton variant="primary">Back to Home</GlowButton>
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Social Signup */}

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input
  type="text"
  name="name"
  onChange={handleChange}
  placeholder="Enter your Name"
  className="w-full pl-12 pr-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50"
/>

                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-violet-500 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-violet-500 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
  <label className="block text-sm font-semibold mb-2">
    Password
  </label>

  <div className="relative">

  <Lock
  className="
    absolute left-4 top-1/2 -translate-y-1/2
    w-5 h-5
    text-black dark:text-white
  "
/>

    {/* INPUT */}
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      onChange={handleChange}
      placeholder="••••••••"
      className="w-full pl-12 pr-12 py-3 rounded-2xl
      backdrop-blur-xl bg-white/60 dark:bg-slate-800/60
      border border-white/20 dark:border-slate-700/50
      focus:ring-2 focus:ring-cyan-500 dark:focus:ring-violet-500
      outline-none transition-all"
      required
    />

    {/* SHOW / HIDE ICON */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5 text-black dark:text-white" />
      ) : (
        <Eye className="w-5 h-5 text-black dark:text-white" />
      )}
    </button>

  </div>
</div>

{/* Referral Code (Optional) */}
<div>
  <label className="block text-sm font-semibold mb-2">
    Referral Code (Optional)
  </label>
  <div className="relative">
    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
    <input
      type="text"
      name="referralCode"
      onChange={handleChange}
      value={formData.referralCode}
      placeholder="Referral Code (if you have one)"
      className="w-full pl-12 pr-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-violet-500 outline-none transition-all"
    />
  </div>
</div>


                    <label className="flex items-start gap-2 cursor-pointer text-sm">
                      <input type="checkbox" className="mt-1 rounded" required />
                      <span className="text-slate-600 dark:text-slate-400">
                        I agree to the Terms of Service and Privacy Policy
                      </span>
                    </label>

                    <GlowButton type="submit" variant="primary" className="w-full">
                      Create Account
                    </GlowButton>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                      Already have an account?{' '}
                      <Link to="/login" className="text-cyan-600 dark:text-violet-400 font-semibold hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </form>
                )}
              </GlassCard>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/30 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [360, 180, 0],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <h2 className="text-5xl font-bold mb-6">Start Your Journey</h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                    Join thousands of users earning daily with Drawboxs
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { value: '50,000+', label: 'Active Users' },
                      { value: '₹10L+', label: 'Paid to Users' },
                      { value: '1M+', label: 'Bills Uploaded' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        <GlassCard className="p-6">
                          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
                            {stat.value}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
