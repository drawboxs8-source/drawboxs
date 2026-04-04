import { motion } from 'motion/react';
import { Gift, Sparkles, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { useEffect, useState } from "react";
import { API } from "../services/api";
import toast from 'react-hot-toast';

export default function Rewards() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await API.get("/rewards/my-cards");
      setRewards(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (rewardId: string) => {
    const toastId = toast.loading("Revealing your reward...");
    try {
      await API.post(`/rewards/reveal/${rewardId}`);
      toast.dismiss(toastId);
      toast.success("Reward revealed!");
      fetchRewards(); // refresh list
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Failed to reveal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="pt-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Gift className="w-10 h-10 text-cyan-500" /> My Rewards
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Check back every week for new scratch cards and coupons!
            </p>
          </motion.div>

          {rewards.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No rewards assigned yet.</p>
              <p className="text-sm">Wait for the admin to upload new weekly rewards!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward, index) => {
                const card = reward.scratchCardId;
                const isExpired = new Date(reward.expiresAt) < new Date();
                const isUsed = reward.isUsed;

                return (
                  <motion.div
                    key={reward._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className={`p-6 relative overflow-hidden h-full flex flex-col ${isExpired ? 'opacity-60 grayscale' : ''}`}>
                      
                      {/* Image Thumbnail */}
                      <div className="mb-4 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex items-center justify-center relative">
                        {isUsed || isExpired ? (
                          <img 
                            src={card.image} 
                            alt={card.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-white/50" />
                            <div className="absolute font-bold text-white text-xl tracking-widest text-center px-4">SCRATCH TO REVEAL</div>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-2">{isUsed ? card.title : "Mystery Reward"}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow mb-4">
                        {isUsed ? card.description : "Reveal your coupon / picture now before it expires!"}
                      </p>

                      <div className="mt-auto space-y-3">
                        {isExpired ? (
                          <div className="flex items-center justify-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold tracking-wider uppercase text-sm border border-red-200 dark:border-red-900/50">
                            <Clock className="w-4 h-4" />
                            Coupon Expired
                          </div>
                        ) : isUsed ? (
                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center cursor-pointer hover:bg-green-500/20 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(card.couponCode);
                              toast.success("Coupon code copied!");
                            }}
                          >
                            <span className="block text-xs text-green-600 dark:text-green-400 font-semibold mb-1 uppercase tracking-wider">Coupon Code (Click to Copy)</span>
                            <span className="block text-xl font-mono font-bold text-green-700 dark:text-green-300 tracking-wider font-mono">
                              {card.couponCode}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReveal(reward._id)}
                            className="w-full p-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-5 h-5" />
                            Reveal Now
                          </button>
                        )}
                        
                        {!isExpired && !isUsed && (
                          <div className="text-xs text-center text-slate-400 flex justify-center items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {isUsed && !isExpired && (
                        <div className="absolute top-4 right-4 bg-green-500 rounded-full text-white p-1">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}

                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
