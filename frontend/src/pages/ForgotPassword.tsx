import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Reset link sent to your email');
      setIsSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-[2rem] blur opacity-20 dark:opacity-30" />
        
        <div className="relative backdrop-blur-xl bg-white/60 dark:bg-slate-900/40 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30 transform -rotate-6">
              <Mail className="w-8 h-8 text-white transform rotate-6" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
              Forgot Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isSent ? "Check your email!" : "Enter your email to receive a reset link"}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all backdrop-blur-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center text-green-700 dark:text-green-400 font-medium mb-6">
              We've sent a secure password reset link to your email. Please check your inbox and spam folders.
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
