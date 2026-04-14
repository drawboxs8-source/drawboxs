import { motion } from 'motion/react';
import { Gift, Sparkles, CheckCircle, Clock, Trash2 } from 'lucide-react';
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

  const handleDelete = async (rewardId: string) => {
    if (!window.confirm("Are you sure you want to delete this reward?")) return;
    const toastId = toast.loading("Deleting reward...");
    try {
      await API.delete(`/rewards/${rewardId}`);
      toast.dismiss(toastId);
      toast.success("Reward deleted!");
      fetchRewards();
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Failed to delete");
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                    <GlassCard className={`p-3 relative overflow-hidden aspect-square flex flex-col group ${isExpired ? 'opacity-60 grayscale' : ''}`}>
                      
                      {/* Delete Button (Visible on Hover/Always on mobile) */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(reward._id);
                        }}
                        className="absolute top-2 left-2 z-10 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Reward"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Image Thumbnail */}
                      <div 
                        className={`mb-2 flex-grow min-h-0 bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative border border-slate-100 dark:border-slate-700 ${isUsed && card.couponLink ? 'cursor-pointer hover:shadow-md transition-all scale-95 hover:scale-100' : ''}`}
                        onClick={() => {
                          if (isUsed && card.couponLink) {
                            window.open(card.couponLink, '_blank');
                          }
                        }}
                      >
                        {isUsed || isExpired ? (
                          <img 
                            src={card.image} 
                            alt={card.title} 
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-600 flex flex-col items-center justify-center gap-1">
                            <Sparkles className="w-8 h-8 text-white/50" />
                            <div className="font-bold text-white text-[10px] tracking-widest text-center px-1 leading-tight">SCRATCH TO REVEAL</div>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <h3 className="text-sm font-bold mb-1 truncate">{isUsed ? card.title : "Mystery Reward"}</h3>
                        <p className="text-[10px] leading-tight text-slate-600 dark:text-slate-400 mb-2 overflow-hidden text-ellipsis line-clamp-2">
                          {isUsed ? card.description : "Reveal your coupon / picture now before it expires!"}
                        </p>

                        <div className="mt-auto space-y-1">
                          {isExpired ? (
                            <div className="flex items-center justify-center gap-1 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-bold tracking-wider uppercase text-[10px] border border-red-200 dark:border-red-900/50">
                              <Clock className="w-3 h-3" />
                              Expired
                            </div>
                          ) : isUsed ? (
                            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-center cursor-pointer hover:bg-green-500/20 transition-colors"
                              onClick={() => {
                                navigator.clipboard.writeText(card.couponCode);
                                toast.success("Coupon code copied!");
                              }}
                            >
                              <span className="block text-[8px] text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">Coupon Code (Copy)</span>
                              <span className="block text-xs font-mono font-bold text-green-700 dark:text-green-300 truncate">
                                {card.couponCode}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleReveal(reward._id)}
                              className="w-full p-1.5 text-xs bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              Reveal
                            </button>
                          )}
                          
                          {!isExpired && !isUsed && (
                            <div className="text-[9px] text-center text-slate-400 flex justify-center items-center gap-1 pt-1">
                              <Clock className="w-2.5 h-2.5" />
                              Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {isUsed && !isExpired && (
                        <div className="absolute top-2 right-2 z-10 bg-green-500 rounded-full text-white p-0.5 shadow-md">
                          <CheckCircle className="w-3 h-3" />
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
