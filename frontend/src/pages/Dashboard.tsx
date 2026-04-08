import { motion, AnimatePresence } from 'motion/react';
import { Coins, Upload, Wallet, Clock, Users, X } from 'lucide-react';
import { Link } from 'react-router';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { useEffect, useRef, useState } from "react";
import { API } from "../services/api";
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [billId, setBillId] = useState("");

  const stats = [
    {
      icon: Coins,
      label: "Total Coins",
      value: user?.coins ?? 0,
      change: `+${user?.coinsEarnedToday ?? 0} today`,
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Upload,
      label: "Bills Uploaded",
      value: user?.totalBillsUploaded ?? 0,
      change: `${user?.billsUploadedToday ?? 0} today`,
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Clock,
      label: "Today Limit Left",
      value: `${Math.max(0, (user?.dailyLimit ?? 3) - (user?.billsUploadedToday ?? 0))}/${user?.dailyLimit ?? 3}`,
      change: user?.planPurchased ? "Premium Plan" : "Free Plan",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Wallet,
      label: "Withdrawable",
      value: `₹${((user?.coins ?? 0) * 0.2).toFixed(1).replace(/\.0$/, '')}`,
      change: (user?.coins ?? 0) >= 5000 ? "Ready" : "Min 5000 coins",
      color: "from-green-400 to-emerald-500",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await API.get("/user/me");
      console.log("User Data:", res.data);

      // Check if user is approved
      if (!res.data.isApproved) {
        toast.error("Your account is pending admin approval");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setUser(res.data);
    } catch (err) {
      console.log("Error:", err);
      toast.error("Failed to load user data");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      toast.success("File selected!");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    // Check upload permission
    if (!user.canUploadBills) {
      toast.error("You don't have permission to upload bills. Contact admin.");
      return;
    }

    // Check if user has plan
    if (!user.planPurchased) {
      toast.error("Please purchase a plan first");
      return;
    }

    // Check if user has reached daily limit
    if (user && user.billsUploadedToday >= (user.dailyLimit || 3)) {
      toast.error("Daily upload limit reached. Upgrade plan or try tomorrow.");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading bill...");

    const formData = new FormData();
    formData.append("bill", selectedFile);

    try {
      const res = await API.post("/bill/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);

      toast.dismiss(uploadToast);

      // Check if upload was blocked
      if (!res.data.billId) {
        toast.error(res.data.message || "Upload failed");
        setUploading(false);
        setSelectedFile(null);
        // Clear file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        return;
      }

      // ✅ GET COINS FROM RESPONSE
      const earned = res.data.coinsRewarded || 3;

      setCoinsEarned(earned);
      setBillId(res.data.billId);

      toast.success("Bill uploaded successfully!");
      setShowScratchCard(true);
      setSelectedFile(null);

      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.log("Upload error:", err);
      toast.dismiss(uploadToast);
      toast.error(err.response?.data?.message || "Upload failed");
      setSelectedFile(null);
      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }

    setUploading(false);
  };

  const handleScratchComplete = async () => {

    /// Close overlay
    setShowScratchCard(false);

    /// Refresh wallet
    await fetchUserData();

    toast.success(
      `+${coinsEarned} coins added!`
    );
  };


  return (
    <div className="min-h-screen pb-20">
      <Header />

      {/* Scratch Card Overlay */}
      <AnimatePresence>
        {showScratchCard && (
          <ScratchCardOverlay
            key={billId}
            coinsEarned={coinsEarned}
            onComplete={handleScratchComplete}
          />
        )}
      </AnimatePresence>

      <div className="pt-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Hi, {user?.name || "User"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Here's your earnings overview</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover neonBorder className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upload Bills Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard neonBorder className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Upload Bill & Earn Coins</h2>

                  {/* File Upload */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Upload Bill Image</h3>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Upload className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-green-600">{selectedFile.name}</p>
                              <p className="text-sm text-slate-500 mt-1">Click to change</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">Click to upload</p>
                              <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedFile && !uploading
                      ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-2xl hover:scale-105"
                      : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                      }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      "Upload Bill & Get Scratch Card"
                    )}
                  </button>
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard neonBorder className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {user?.email}
                  </p>
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold inline-block">
                    {user?.planPurchased ? "Premium Member" : "Free Member"}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Plan Status */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Plan Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Current Plan</span>
                      <span className="font-semibold">
                        {user?.planPurchased ? user.planName : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Limit</span>
                      <span className="font-semibold">
                        {user?.dailyLimit ?? 3} bills
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan Validity</span>
                      <span className="font-semibold">
                        {user?.planExpiry
                          ? new Date(user.planExpiry).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <motion.a
                    href="/pricing"
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-cyan-500 dark:border-violet-500 hover:bg-cyan-500/10 dark:hover:bg-violet-500/10 transition-all font-semibold"
                    whileHover={{ scale: 1.02 }}
                  >
                    Upgrade Plan
                  </motion.a>
                </GlassCard>
              </motion.div>
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>

                  <div className="space-y-3">

                    {/* View History */}
                    <Link
                      to="/coins-history"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <Coins className="w-5 h-5 text-cyan-600 dark:text-violet-400" />
                      <span className="font-semibold">View History</span>
                    </Link>

                    {/* Withdraw */}
                    <Link
                      to="/withdrawal"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <Wallet className="w-5 h-5 text-cyan-600 dark:text-violet-400" />
                      <span className="font-semibold">Withdraw Coins</span>
                    </Link>

                  </div>

                  {/* Referral Link */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-orange-500">Refer & Earn 100 Coins</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Share this referral code with your friends.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={user?.referralCode || ''}
                        className="flex-1 bg-white/50 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 outline-none font-mono font-bold tracking-widest text-center"
                      />
                      <button
                        onClick={() => {
                          const code = user?.referralCode || '';
                          if (code) {
                            navigator.clipboard.writeText(code);
                            toast.success("Referral code copied!");
                          }
                        }}
                        className="px-3 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scratch Card Overlay Component
function ScratchCardOverlay({ coinsEarned, onComplete }: { coinsEarned: number; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const gradient = ctx.createLinearGradient(0, 0, 300, 300);
    gradient.addColorStop(0, '#94a3b8');
    gradient.addColorStop(1, '#64748b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 300);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', 150, 140);
    ctx.font = '48px sans-serif';
    ctx.fillText('❓', 150, 190);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 60, 0, Math.PI * 2);

    ctx.fill();

    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 40 && !isRevealed) {

      setIsRevealed(true);

      /// Wait reveal animation
      setTimeout(() => {

        onComplete();

      }, 1800); // longer
    }

  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6 pointer-events-auto"

    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="relative max-w-md w-full"
      >
        <GlassCard className="p-8 relative">
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-5xl mb-3"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-bold text-black mb-2">
              Bill Uploaded!
            </h2>
            <p className="text-white/70">Scratch to reveal your reward</p>
          </div>

          <div
            className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl mb-6"
            style={{ width: '300px', height: '300px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={isRevealed ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-center cursor-pointer select-none"
                onClick={() => window.location.href = '/rewards'}
              >
                <div className="text-8xl mb-4">
                  🪙
                </div>
                <div className="text-6xl font-bold text-white mb-2">
                  {coinsEarned} Coins
                </div>
                <div className="text-2xl text-black/90 font-semibold mb-4">Added</div>
                <div className="inline-block px-6 py-2 bg-white text-white-600 font-bold rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  See Rewards 🎁
                </div>
              </motion.div>
            </div>

            {!isRevealed && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-crosshair"
                style={{ touchAction: "none" }}
                onPointerDown={(e) => {
                  setIsScratching(true);
                  scratch(e.clientX, e.clientY);
                }}
                onPointerUp={() => setIsScratching(false)}
                onPointerLeave={() => setIsScratching(false)}
                onPointerMove={(e) => {
                  if (isScratching) {
                    scratch(e.clientX, e.clientY);
                  }
                }}
                onMouseDown={(e) => {
                  setIsScratching(true);
                  scratch(e.clientX, e.clientY);
                }}
                onMouseUp={() => setIsScratching(false)}
                onMouseLeave={() => setIsScratching(false)}
                onMouseMove={(e) => {
                  if (isScratching) scratch(e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  setIsScratching(true);
                  if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchEnd={() => setIsScratching(false)}
                onTouchMove={(e) => {
                  if (isScratching && e.touches[0]) {
                    e.preventDefault();
                    scratch(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
              />
            )}
          </div>

          {!isRevealed && scratchPercentage > 5 && (
            <div className="text-center mb-4">
              <div className="text-white/70 text-sm mb-2">
                {Math.round(scratchPercentage)}% scratched
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
                  style={{ width: `${scratchPercentage}%` }}
                />
              </div>
            </div>
          )}

          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-green-400 font-semibold mb-2"
            >
              ✓ Coins will be added to your wallet!
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}