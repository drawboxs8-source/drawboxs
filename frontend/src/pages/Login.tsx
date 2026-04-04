import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Mail, Lock, LogIn } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState } from 'react';
import { API } from "../services/api";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";



export default function Login() {
  const [showApproval, setShowApproval] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  email: "",
  password: ""
  });

  const handleChange = (e: any) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await API.post(
      "/auth/login",
      formData
    );

    /// If backend returned string → error case
    if (typeof res.data === "string") {

      if (res.data === "User not found") {
        toast.error("User not registered");
        return;
      }

      if (res.data === "Wrong password") {
        toast.error("Incorrect password");
        return;
      }

      if (res.data === "Admin approval pending") {
        setShowApproval(true);
        return;
      }
    }

    /// Success case → token exists
if (res.data.token) {

  // Save token
  localStorage.setItem(
    "token",
    res.data.token
  );

  // Save role
  localStorage.setItem(
    "role",
    res.data.user.role
  );

  // Redirect based on role
  if (res.data.user.role === "admin") {
    navigate("/admin");        // 👈 your admin route
  } else {
    navigate("/dashboard");
  }
}

  } catch (error) {
    console.log(error);
    toast.error("Login Failed");
  }
};


  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <motion.div
                  className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-600/30 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <h2 className="text-5xl font-bold mb-6">Welcome Back!</h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                    Continue your journey with Drawboxs and keep earning coins
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: LogIn, text: 'Secure login' },
                      { icon: Mail, text: 'Email verification' },
                      { icon: Lock, text: 'Data protection' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard neonBorder className="p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Login</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Sign in to your Drawboxs account
                </p>

                {showApproval ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Waiting for Approval</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Your account is pending admin approval. You'll receive an email once approved.
                    </p>
                    <Link to="/">
                      <GlowButton variant="outline">Back to Home</GlowButton>
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Social Login */}

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

                    {/* Password */}
<div>
  <label className="block text-sm font-semibold mb-2">
    Password
  </label>

  <div className="relative">

    {/* LOCK ICON */}
    <Lock
      className="
        absolute left-4 top-1/2 -translate-y-1/2
        w-5 h-5
        text-slate-700 dark:text-slate-300
      "
    />

    {/* PASSWORD INPUT */}
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      onChange={handleChange}
      placeholder="••••••••"
      className="
        w-full pl-12 pr-12 py-3 rounded-2xl
        backdrop-blur-xl
        bg-white/60 dark:bg-slate-800/60
        border border-white/20 dark:border-slate-700/50
        focus:ring-2 focus:ring-cyan-500 dark:focus:ring-violet-500
        outline-none transition-all
      "
      required
    />

    {/* EYE ICON */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="
        absolute right-4 top-1/2 -translate-y-1/2
        text-slate-600 dark:text-slate-300
        hover:text-cyan-500 dark:hover:text-violet-400
        transition-colors
      "
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>

  </div>
</div>


                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-cyan-600 dark:text-violet-400 hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <GlowButton type="submit" variant="primary" className="w-full">
                      Sign In
                    </GlowButton>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-cyan-600 dark:text-violet-400 font-semibold hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
