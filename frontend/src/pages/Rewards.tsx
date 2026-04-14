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
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 dark:text-white">
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
                      className={`relative w-full aspect-square rounded-[16px] overflow-hidden flex flex-col group cursor-pointer shadow border border-[#27272a] bg-[#18181b] ${isExpired ? 'opacity-60 grayscale' : ''}`}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {/* Image Area - takes up exactly 60% of the square */}
                      <div className="h-[65%] w-full relative bg-white shrink-0 p-2 border-b border-[#27272a]">
                        {isUsed || isExpired ? (
                          <img 
                            src={card.image} 
                            alt={card.title} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex flex-col items-center justify-center gap-2">
                            <Sparkles className="w-8 h-8 text-white/50 animate-pulse" />
                            <div className="font-bold text-white text-[10px] tracking-widest text-center px-1">SCRATCH REVEAL</div>
                          </div>
                        )}
                        
                        {/* Status Icon */}
                        {isUsed && !isExpired && (
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full text-green-400 p-1">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Content Area - takes remaining 35% */}
                      <div className="h-[35%] p-3 flex flex-col justify-center bg-[#18181b]">
                        <div className="flex justify-between items-center gap-2 mb-0.5">
                           <h3 className="text-[14px] font-bold truncate text-white">
                             {isUsed ? card.title : "Mystery Reward"}
                           </h3>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] line-clamp-2 leading-tight">
                          {isUsed ? card.description : "Tap to view details and reveal your surprise!"}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-md bg-[#121212] sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col text-white"
            >
              {(() => {
                const { card, isExpired, isUsed } = getCardInfo(selectedReward)!;
                
                return (
                  <>
                    {/* Header Controls layer over image */}
                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
                      <button 
                        onClick={() => setSelectedReward(null)}
                        className="pointer-events-auto bg-black/40 hover:bg-black/60 shadow-md backdrop-blur-md text-white rounded-full p-2 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleDelete(selectedReward._id, e)}
                          className="pointer-events-auto bg-black/40 hover:bg-black/60 shadow-md backdrop-blur-md text-white rounded-full p-2 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {}}
                          className="pointer-events-auto bg-black/40 hover:bg-black/60 shadow-md backdrop-blur-md text-white rounded-full p-2 transition-colors"
                        >
                          <HelpCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                      {/* Banner Image Area */}
                      <div className="h-[240px] w-full relative bg-white border-b border-[#27272a] shrink-0 flex items-center justify-center p-6 mt-12 sm:mt-0">
                        {isUsed || isExpired ? (
                          <img 
                            src={card.image} 
                            alt={card.title} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex flex-col items-center justify-center gap-3">
                            <Sparkles className="w-12 h-12 text-white/30" />
                            <div className="font-black text-white text-xl tracking-[0.2em] text-center px-4 opacity-50">HIDDEN REWARD</div>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-6">
                        {/* Title & Subtitle */}
                        <div>
                          <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                            {isUsed ? card.description : "Mystery Coupon Box"}
                          </h2>
                          <p className="text-[#a1a1aa] text-sm">
                            on {isUsed ? card.title : "Mystery App"} website/App
                          </p>
                        </div>

                        {/* Actions & Code Box */}
                        <div>
                          {isExpired ? (
                            <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-red-500 font-medium">
                              This offer expired on {new Date(selectedReward.expiresAt).toLocaleDateString()}
                            </div>
                          ) : !isUsed ? (
                            <button
                              onClick={() => handleReveal(selectedReward._id)}
                              className="w-full py-4 text-[15px] font-bold rounded-[14px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors"
                            >
                              Unlock Reward Now
                            </button>
                          ) : (
                            <div className="flex flex-col gap-4">
                              {/* Dotted Coupon Code Box */}
                              <div className="border border-dashed border-[#404040] rounded-[14px] p-4 flex items-center justify-between font-mono bg-[#1a1a1a]">
                                <div className="text-white text-sm flex gap-2">
                                  <span className="text-[#a1a1aa]">Code:</span>
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
                        <div className="flex flex-col border-t border-[#27272a] pt-4 gap-1">
                          <button className="w-full flex items-center gap-4 py-3.5 hover:bg-white/5 px-2 rounded-xl transition-colors text-left group">
                            <Clock className="w-5 h-5 text-[#a1a1aa]" />
                            <span className="flex-1 text-[15px] text-[#e4e4e7]">
                              {isExpired ? 'Expired on' : 'Expires on'} {new Date(selectedReward.expiresAt).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </button>
                          
                          <button className="w-full flex justify-between items-center py-3.5 hover:bg-white/5 px-2 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-4">
                              <FileText className="w-5 h-5 text-[#a1a1aa]" />
                              <span className="text-[15px] text-[#e4e4e7]">Offer Details</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-white transition-colors" />
                          </button>
                          
                          <button className="w-full flex justify-between items-center py-3.5 hover:bg-white/5 px-2 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-4">
                              <FileText className="w-5 h-5 text-[#a1a1aa]" />
                              <span className="text-[15px] text-[#e4e4e7]">About {isUsed ? card.title : "Partner"}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-white transition-colors" />
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
