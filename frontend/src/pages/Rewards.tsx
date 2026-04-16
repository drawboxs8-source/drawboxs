import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, CheckCircle, Clock, Trash2, ArrowLeft, HelpCircle, FileText, ExternalLink, Copy, ChevronRight } from 'lucide-react';
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
      
      setRewards(prev => prev.map(r => r._id === rewardId ? res.data.reward : r));
      if (selectedReward && selectedReward._id === rewardId) {
        setSelectedReward(res.data.reward);
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Failed to reveal");
    }
  };

  const handleDelete = async (rewardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      <div className="min-h-screen pb-20 flex items-center justify-center dark:bg-[#0a0a0c]">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getCardInfo = (reward: any) => {
    if (!reward) return null;
    const card = reward.scratchCardId;
    const isExpired = new Date(reward.expiresAt) < new Date();
    const isUsed = reward.isUsed;
    return { card, isExpired, isUsed };
  };

  return (
    <div className="min-h-screen pb-20 dark:bg-[#0a0a0c] bg-slate-50 font-sans">
      <Header />

      <div className="pt-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 dark:text-white text-slate-900">
              <Gift className="w-8 h-8 text-cyan-500" /> My Rewards
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {rewards.map((reward, index) => {
                const { card, isExpired, isUsed } = getCardInfo(reward)!;

                return (
                  <motion.div
                    key={reward._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div 
                      className={`relative w-full aspect-square rounded-[16px] overflow-hidden flex flex-col group cursor-pointer shadow border dark:border-[#27272a] border-slate-200 dark:bg-[#18181b] bg-white ${isExpired ? 'opacity-60 grayscale' : ''}`}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {/* Image Area - takes up exactly 60% of the square */}
                      <div className="h-[65%] w-full relative dark:bg-[#1a1a1a] bg-white shrink-0 p-2 border-b dark:border-[#27272a] border-slate-200">
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Status Icon */}
                        {isUsed && !isExpired && (
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full text-green-400 p-1">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Content Area - takes remaining 35% */}
                      <div className="h-[35%] p-3 flex flex-col justify-center dark:bg-[#18181b] bg-white">
                        <div className="flex justify-between items-center gap-2 mb-0.5">
                           <h3 className="text-[14px] font-bold truncate dark:text-white text-slate-900">
                             {card.title}
                           </h3>
                        </div>
                        <p className="text-[11px] dark:text-[#a1a1aa] text-slate-500 line-clamp-2 leading-tight">
                          {card.description}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal / Full Screen Mobile View */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center dark:bg-black/70 bg-slate-900/30 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-md dark:bg-[#121212] bg-white sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col dark:text-white text-slate-900"
            >
              {(() => {
                const { card, isExpired, isUsed } = getCardInfo(selectedReward)!;
                
                return (
                  <>
                    {/* Header Controls */}
                    <div className="w-full p-4 flex justify-between items-center border-b dark:border-[#27272a] border-slate-200 shrink-0 bg-white dark:bg-[#121212]">
                      <button 
                        onClick={() => setSelectedReward(null)}
                        className="dark:bg-[#1a1a1a] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#27272a] dark:text-white text-slate-900 rounded-full p-2 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleDelete(selectedReward._id, e)}
                          className="dark:bg-[#1a1a1a] bg-slate-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/20 dark:text-white text-slate-900 transition-colors rounded-full p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          className="dark:bg-[#1a1a1a] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#27272a] dark:text-white text-slate-900 rounded-full p-2 transition-colors"
                        >
                          <HelpCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                      <div className="p-5 flex flex-col gap-6">
                        {/* Compact Header with Image and Title */}
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[12px] border dark:border-[#27272a] border-slate-200 dark:bg-[#1a1a1a] bg-white flex items-center justify-center p-2 shrink-0">
                            <img 
                              src={card.image} 
                              alt={card.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h2 className="text-[16px] sm:text-lg font-bold dark:text-white text-slate-900 leading-tight mb-1">
                              {card.description}
                            </h2>
                            <p className="dark:text-[#a1a1aa] text-slate-500 text-sm">
                              on {card.title}
                            </p>
                          </div>
                        </div>

                        {/* Actions & Code Box */}
                        <div>
                          {isExpired ? (
                            <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-red-500 font-medium">
                              This offer expired on {new Date(selectedReward.expiresAt).toLocaleDateString()}
                            </div>
                          ) : !isUsed ? (
                            <div className="flex flex-col gap-4">
                              <div className="border border-dashed dark:border-[#404040] border-slate-300 rounded-[14px] p-4 flex items-center justify-between font-mono dark:bg-[#1a1a1a] bg-slate-50">
                                <div className="dark:text-white text-slate-900 text-sm flex gap-2">
                                  <span className="dark:text-[#a1a1aa] text-slate-500">Code:</span>
                                  <span className="font-bold tracking-wider">********</span>
                                </div>
                                <button 
                                  onClick={() => handleReveal(selectedReward._id)}
                                  className="text-[#a78bfa] font-bold text-sm hover:text-[#c4b5fd]"
                                >
                                  Unlock
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  if (card.couponLink) {
                                    window.open(card.couponLink, '_blank');
                                  } else {
                                    toast.success("Offer noted! Check your email or retailer for details.");
                                  }
                                }}
                                className="w-full py-4 text-[15px] font-bold rounded-[14px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
                              >
                                BUY NOW
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4">
                              {/* Dotted Coupon Code Box */}
                              <div className="border border-dashed dark:border-[#404040] border-slate-300 rounded-[14px] p-4 flex items-center justify-between font-mono dark:bg-[#1a1a1a] bg-slate-50">
                                <div className="dark:text-white text-slate-900 text-sm flex gap-2">
                                  <span className="dark:text-[#a1a1aa] text-slate-500">Code:</span>
                                  <span className="font-bold tracking-wider">{card.couponCode && card.couponCode !== "NO" ? card.couponCode : "NO CODE NEEDED"}</span>
                                </div>
                                {card.couponCode && card.couponCode !== "NO" && (
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(card.couponCode);
                                      toast.success("Coupon code copied!");
                                    }}
                                    className="text-[#a78bfa] font-bold text-sm hover:text-[#c4b5fd]"
                                  >
                                    Copy
                                  </button>
                                )}
                              </div>
                              
                              {/* Primary Action Button */}
                              <button
                                onClick={() => {
                                  if (card.couponLink) {
                                    window.open(card.couponLink, '_blank');
                                  } else {
                                    toast.success("Offer noted! Check your email or retailer for details.");
                                  }
                                }}
                                className="w-full py-4 text-[15px] font-bold rounded-[14px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
                              >
                                BUY NOW
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Info List */}
                        <div className="flex flex-col border-t dark:border-[#27272a] border-slate-200 pt-4 gap-1">
                          <button className="w-full flex items-center gap-4 py-3.5 dark:hover:bg-white/5 hover:bg-slate-50 px-2 rounded-xl transition-colors text-left group">
                            <Clock className="w-5 h-5 dark:text-[#a1a1aa] text-slate-500" />
                            <span className="flex-1 text-[15px] dark:text-[#e4e4e7] text-slate-700">
                              {isExpired ? 'Expired on' : 'Expires on'} {new Date(selectedReward.expiresAt).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </button>
                          
                          <button className="w-full flex justify-between items-center py-3.5 dark:hover:bg-white/5 hover:bg-slate-50 px-2 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-4">
                              <FileText className="w-5 h-5 dark:text-[#a1a1aa] text-slate-500" />
                              <span className="text-[15px] dark:text-[#e4e4e7] text-slate-700">Offer Details</span>
                            </div>
                            <ChevronRight className="w-5 h-5 dark:text-[#52525b] text-slate-400 dark:group-hover:text-white group-hover:text-slate-900 transition-colors" />
                          </button>
                          
                          <button className="w-full flex justify-between items-center py-3.5 dark:hover:bg-white/5 hover:bg-slate-50 px-2 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-4">
                              <FileText className="w-5 h-5 dark:text-[#a1a1aa] text-slate-500" />
                              <span className="text-[15px] dark:text-[#e4e4e7] text-slate-700">About {card.title}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 dark:text-[#52525b] text-slate-400 dark:group-hover:text-white group-hover:text-slate-900 transition-colors" />
                          </button>
                        </div>

                        {/* Extra bottom padding for mobile scroll */}
                        <div className="h-4"></div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
