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
      {selectedReward && (() => {
        const { card, isExpired, isUsed } = getCardInfo(selectedReward)!;
        
        return (
          <div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 2147483600, backgroundColor: "var(--background)" }}
          >
            <div 
              className="w-full h-full max-w-md shadow-2xl flex flex-col border-x"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              {/* Header Controls */}
              <div 
                className="w-full p-4 flex justify-between items-center border-b shrink-0"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <button 
                  onClick={() => setSelectedReward(null)}
                  className="rounded-full p-2 transition-colors cursor-pointer"
                  style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleDelete(selectedReward._id, e)}
                    className="hover:text-red-500 transition-colors rounded-full p-2 cursor-pointer"
                    style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    className="rounded-full p-2 transition-colors"
                    style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <div className="p-5 flex flex-col gap-6">
                  {/* Compact Header with Image and Title */}
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-[12px] border flex items-center justify-center p-2 shrink-0"
                      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                    >
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 
                        className="text-[16px] sm:text-lg font-bold leading-tight mb-1 line-clamp-3"
                        style={{ color: "var(--foreground)" }}
                      >
                        {card.description}
                      </h2>
                      <p 
                        className="text-sm truncate"
                        style={{ color: "var(--muted-foreground)" }}
                      >
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
                        <div 
                          className="border border-dashed rounded-[14px] p-4 flex items-center justify-between font-mono"
                          style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
                        >
                          <div className="text-sm flex gap-2" style={{ color: "var(--foreground)" }}>
                            <span style={{ color: "var(--muted-foreground)" }}>Code:</span>
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
                        <div 
                          className="border border-dashed rounded-[14px] p-4 flex items-center justify-between font-mono"
                          style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
                        >
                          <div className="text-sm flex gap-2" style={{ color: "var(--foreground)" }}>
                            <span style={{ color: "var(--muted-foreground)" }}>Code:</span>
                            <span className="font-bold tracking-wider truncate" style={{ color: "var(--foreground)" }}>{card.couponCode && card.couponCode !== "NO" ? card.couponCode : "NO CODE NEEDED"}</span>
                          </div>
                          {card.couponCode && card.couponCode !== "NO" && (
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(card.couponCode);
                                toast.success("Coupon code copied!");
                              }}
                              className="text-[#a78bfa] font-bold text-sm hover:text-[#c4b5fd] shrink-0 ml-2"
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
                  <div 
                    className="flex flex-col border-t pt-4 gap-1"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button className="w-full flex items-center gap-4 py-3.5 hover:opacity-80 px-2 rounded-xl transition-colors text-left group">
                      <Clock className="w-5 h-5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                      <span className="flex-1 text-[15px]" style={{ color: "var(--foreground)" }}>
                        {isExpired ? 'Expired on' : 'Expires on'} {new Date(selectedReward.expiresAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </button>
                    
                    <button className="w-full flex justify-between items-center py-3.5 hover:opacity-80 px-2 rounded-xl transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                        <span className="text-[15px]" style={{ color: "var(--foreground)" }}>Offer Details</span>
                      </div>
                      <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                    </button>
                    
                    <button className="w-full flex justify-between items-center py-3.5 hover:opacity-80 px-2 rounded-xl transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                        <span className="text-[15px] truncate" style={{ color: "var(--foreground)" }}>About {card.title}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                    </button>
                  </div>

                  {/* Extra bottom padding for mobile scroll */}
                  <div className="h-4"></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
