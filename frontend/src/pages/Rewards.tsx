import { motion } from 'motion/react';
import { Gift, Sparkles, CheckCircle, Clock, Trash2, X, ExternalLink, Copy } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { useEffect, useState } from "react";
import { API } from "../services/api";
import toast from 'react-hot-toast';

export default function Rewards() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<any>(null);

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
      const res = await API.post(`/rewards/reveal/${rewardId}`);
      toast.dismiss(toastId);
      toast.success("Reward revealed!");
      
      // Update local state without fetching again to prevent modal from closing abruptly
      setRewards(prev => prev.map(r => r._id === rewardId ? res.data.reward : r));
      if (selectedReward && selectedReward._id === rewardId) {
        setSelectedReward(res.data.reward);
      }
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
      setSelectedReward(null);
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

  // Helper to determine if we should show the real info
  const getCardInfo = (reward: any) => {
    if (!reward) return null;
    const card = reward.scratchCardId;
    const isExpired = new Date(reward.expiresAt) < new Date();
    const isUsed = reward.isUsed;
    return { card, isExpired, isUsed };
  };

  return (
    <div className="min-h-screen pb-20 dark:bg-slate-950">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {rewards.map((reward, index) => {
                const { card, isExpired, isUsed } = getCardInfo(reward)!;

                return (
                  <motion.div
                    key={reward._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard 
                      className={`p-0 overflow-hidden flex flex-col group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a1a1e] ${isExpired ? 'opacity-60 grayscale' : ''}`}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {/* Image Area - edge to edge */}
                      <div className="relative h-32 sm:h-40 w-full bg-slate-200 dark:bg-slate-800 shrink-0 border-b border-transparent">
                        {isUsed || isExpired ? (
                          <img 
                            src={card.image} 
                            alt={card.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-violet-700 flex flex-col items-center justify-center gap-2">
                            <Sparkles className="w-8 h-8 text-white/50 animate-pulse" />
                            <div className="font-bold text-white text-[12px] tracking-widest text-center px-1">SCRATCH TO REVEAL</div>
                          </div>
                        )}
                        
                        {/* Status Icon */}
                        {isUsed && !isExpired && (
                          <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm rounded-full text-white p-1 shadow-lg">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        
                        {/* Delete Button (floating on hover) */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(reward._id);
                          }}
                          className="absolute top-2 left-2 z-10 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Reward"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex-grow flex flex-col justify-between bg-white dark:bg-[#161618]">
                        <div>
                          <h3 className="text-base font-bold mb-1 truncate dark:text-gray-100">
                            {isUsed ? card.title : "Mystery Reward"}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {isUsed ? card.description : "You have a hidden reward! Tap to view details and reveal."}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReward && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedReward(null)}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedReward(null)}
              className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const { card, isExpired, isUsed } = getCardInfo(selectedReward)!;
              
              return (
                <div className="overflow-y-auto">
                  {/* Banner Image */}
                  <div className="h-56 w-full relative bg-slate-200 dark:bg-slate-800 shrink-0">
                    {isUsed || isExpired ? (
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-violet-700 flex flex-col items-center justify-center gap-3">
                        <Sparkles className="w-12 h-12 text-white/30" />
                        <div className="font-black text-white text-xl tracking-[0.2em] text-center px-4 opacity-50">HIDDEN FATE</div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Header Info */}
                    <div className="mb-6 flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-bold dark:text-white mb-1">
                          {isUsed ? card.title : "Mystery Reward Box"}
                        </h2>
                        {isUsed && !isExpired && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Revealed
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                            <Clock className="w-3.5 h-3.5" />
                            Expired
                          </span>
                        )}
                      </div>
                      
                      {/* Delete Action inside Modal */}
                      <button 
                        onClick={() => handleDelete(selectedReward._id)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-full transition-colors shrink-0"
                        title="Delete Reward"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Description Section */}
                    {isUsed ? (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Offer Details</h4>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6 text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <Gift className="w-10 h-10 mx-auto text-cyan-500 mb-3 opacity-80" />
                        <p className="text-slate-600 dark:text-slate-400 px-4">
                          Scratch and reveal to see your brand new offer! Discover exciting coupon codes and special links inside.
                        </p>
                      </div>
                    )}

                    {/* Actions & Codes */}
                    <div className="space-y-4">
                      {isExpired ? (
                        <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-center text-red-600 dark:text-red-400 font-medium">
                          This reward has expired on {new Date(selectedReward.expiresAt).toLocaleDateString()}
                        </div>
                      ) : !isUsed ? (
                        <button
                          onClick={() => handleReveal(selectedReward._id)}
                          className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                          <Sparkles className="w-5 h-5" />
                          Scratch & Reveal Now
                        </button>
                      ) : (
                        <div className="space-y-3">
                          {/* Coupon Code block */}
                          {card.couponCode && card.couponCode !== "NO" && (
                            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-4 flex items-center justify-between group">
                              <div>
                                <h4 className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">Coupon Code</h4>
                                <span className="font-mono text-xl font-bold text-green-800 dark:text-green-400 tracking-wide">
                                  {card.couponCode}
                                </span>
                              </div>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(card.couponCode);
                                  toast.success("Coupon code copied!");
                                }}
                                className="bg-green-100 dark:bg-green-500/20 hover:bg-green-200 dark:hover:bg-green-500/30 text-green-700 dark:text-green-400 p-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                              >
                                <Copy className="w-4 h-4" /> Copy
                              </button>
                            </div>
                          )}

                          {/* Action Button */}
                          <button
                            onClick={() => {
                              if (card.couponLink) {
                                window.open(card.couponLink, '_blank');
                              } else {
                                toast.success("Offer noted! Check your email or retailer for details.");
                              }
                            }}
                            className="w-full py-3.5 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Redeem Offer</span>
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {!isExpired && (
                        <div className="text-center mt-6 flex justify-center items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Valid until {new Date(selectedReward.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })()}

          </motion.div>
        </div>
      )}

    </div>
  );
}
