import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Gift,
  HelpCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { API } from '../services/api';
import toast from 'react-hot-toast';

type ScratchCard = {
  title?: string;
  description?: string;
  image?: string;
  couponCode?: string;
  couponLink?: string;
};

type Reward = {
  _id: string;
  scratchCardId?: ScratchCard;
  expiresAt: string;
  isUsed: boolean;
};

const formatRewardDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await API.get('/rewards/my-cards');
      setRewards(res.data);
    } catch (err) {
      console.log(err);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (rewardId: string) => {
    const toastId = toast.loading('Revealing your reward...');
    try {
      const res = await API.post(`/rewards/reveal/${rewardId}`);
      toast.dismiss(toastId);
      toast.success('Reward revealed!');

      setRewards((prev) => prev.map((reward) => (reward._id === rewardId ? res.data.reward : reward)));
      if (selectedReward?._id === rewardId) {
        setSelectedReward(res.data.reward);
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to reveal');
    }
  };

  const handleDelete = async (rewardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this reward?')) return;
    const toastId = toast.loading('Deleting reward...');
    try {
      await API.delete(`/rewards/${rewardId}`);
      toast.dismiss(toastId);
      toast.success('Reward deleted!');
      setSelectedReward(null);
      fetchRewards();
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center dark:bg-[#0a0a0c] bg-slate-950">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-400/80 border-t-transparent animate-spin" />
      </div>
    );
  }

  const getCardInfo = (reward: Reward) => {
    const card = reward?.scratchCardId ?? {};
    const isExpired = new Date(reward.expiresAt) < new Date();
    const isUsed = reward.isUsed;
    const hasCode = Boolean(card.couponCode && card.couponCode !== 'NO');
    const displayCode = hasCode ? card.couponCode : 'NO CODE NEEDED';
    return { card, isExpired, isUsed, hasCode, displayCode };
  };

  const openRewardLink = (couponLink?: string) => {
    if (couponLink) {
      window.open(couponLink, '_blank');
      return;
    }

    toast.success('Offer noted! Check your email or retailer for details.');
  };

  return (
    <div className="min-h-screen pb-20 font-sans bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(168,85,247,0.22),_transparent_24%),linear-gradient(180deg,_#09090f_0%,_#140f2b_45%,_#21123d_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(168,85,247,0.22),_transparent_24%),linear-gradient(180deg,_#09090f_0%,_#140f2b_45%,_#21123d_100%)] bg-slate-50">
      <Header />

      <div className="relative overflow-hidden pt-8 px-4 sm:px-6">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-[8%] top-28 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[10%] top-12 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute bottom-20 left-[20%] h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10 rounded-[28px] border border-white/10 bg-white/8 p-6 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_rgba(8,8,20,0.35)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Weekly Offers
                </div>
                <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
                    <Gift className="h-6 w-6 text-white" />
                  </span>
                  My Rewards
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                  Your rewards should feel premium, not cramped. Each card now gives the offer image, status,
                  and actions enough breathing room.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Total</div>
                  <div className="mt-1 text-2xl font-bold text-white">{rewards.length}</div>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Unlocked</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-100">
                    {rewards.filter((reward) => reward.isUsed).length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {rewards.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-black/20 px-6 py-20 text-center text-white/65 backdrop-blur-xl">
              <Sparkles className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg font-semibold text-white">No rewards assigned yet.</p>
              <p className="mt-2 text-sm text-white/60">Wait for the admin to upload new weekly rewards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rewards.map((reward, index) => {
                const { card, isExpired, isUsed, hasCode } = getCardInfo(reward);

                return (
                  <motion.button
                    key={reward._id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedReward(reward)}
                    className={`group relative overflow-hidden rounded-[28px] border text-left backdrop-blur-xl transition-all duration-300 ${
                      isExpired
                        ? 'border-white/10 bg-white/5 opacity-65'
                        : 'border-white/12 bg-white/10 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/14'
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent opacity-80" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between px-4 pt-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            isExpired
                              ? 'bg-red-500/15 text-red-100'
                              : isUsed
                                ? 'bg-emerald-500/15 text-emerald-100'
                                : 'bg-amber-400/15 text-amber-100'
                          }`}
                        >
                          {isExpired ? 'Expired' : isUsed ? 'Unlocked' : 'Locked'}
                        </span>
                        {isUsed && !isExpired ? (
                          <span className="rounded-full bg-emerald-400/15 p-2 text-emerald-200">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        ) : null}
                      </div>

                      <div className="px-4 pt-4">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.title || 'Reward'}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                              <Gift className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
                        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white">
                          {card.title || 'Untitled reward'}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/68">
                          {card.description || 'Reward details will appear here once the admin adds them.'}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Access</div>
                            <div className="mt-1 text-sm font-semibold text-white/90">
                              {hasCode ? 'Coupon Code' : 'Direct Offer'}
                            </div>
                          </div>
                          <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                            {formatRewardDate(reward.expiresAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedReward && (() => {
        const { card, isExpired, isUsed, hasCode, displayCode } = getCardInfo(selectedReward);
        
        return (
          <div className="fixed inset-0 z-[2147483600] flex items-end justify-center bg-slate-950/78 p-0 backdrop-blur-md sm:items-center sm:p-6">
            <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[32px] border border-white/10 bg-[#0b0c12] text-white shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:h-auto sm:max-h-[90vh] sm:rounded-[32px]">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-4 sm:px-6">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/12"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(selectedReward._id, e)}
                    className="rounded-full border border-white/10 bg-white/8 p-2.5 text-white/80 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-full border border-white/10 bg-white/8 p-2.5 text-white/80 transition hover:bg-white/12">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-500/10 p-4">
                    <div className="overflow-hidden rounded-[24px] bg-white p-4">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title || 'Reward'}
                          className="h-[220px] w-full rounded-[18px] object-contain sm:h-[300px]"
                        />
                      ) : (
                        <div className="flex h-[220px] items-center justify-center rounded-[18px] bg-slate-100 text-slate-500 sm:h-[300px]">
                          <Gift className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Status</div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {isExpired ? 'Expired' : isUsed ? 'Unlocked' : 'Ready to unlock'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Code Type</div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {hasCode ? 'Coupon code' : 'No code needed'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Expires</div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {formatRewardDate(selectedReward.expiresAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-5 sm:p-6">
                  <div className="mb-6">
                    <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      Reward details
                    </div>
                    <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
                      {card.title || 'Untitled reward'}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/68 sm:text-base">
                      {card.description || 'No detailed description has been added for this reward yet.'}
                    </p>
                  </div>

                  {isExpired ? (
                    <div className="rounded-[24px] border border-red-400/25 bg-red-500/10 p-5 text-red-100">
                      This offer expired on {formatRewardDate(selectedReward.expiresAt)}.
                    </div>
                  ) : (
                    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Coupon access</div>
                          <div className="mt-2 text-2xl font-black tracking-[0.18em] text-white">
                            {isUsed ? displayCode : '********'}
                          </div>
                        </div>
                        {isUsed && hasCode ? (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(displayCode || '');
                              toast.success('Coupon code copied!');
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/12"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/60">
                        {isUsed
                          ? 'Use this code at checkout, or tap the button below to open the offer page.'
                          : 'Unlock the reward first, then copy the code or open the retailer page.'}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {!isUsed ? (
                          <button
                            onClick={() => handleReveal(selectedReward._id)}
                            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                          >
                            Unlock Reward
                          </button>
                        ) : (
                          <button
                            onClick={() => openRewardLink(card.couponLink)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                          >
                            Open Offer
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => openRewardLink(card.couponLink)}
                          className="rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-sm font-semibold text-white/85 transition hover:bg-white/12"
                        >
                          {isUsed ? 'Visit Store' : 'Preview Offer'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="flex items-center gap-3 text-sm font-semibold text-white">
                        <Clock className="h-4 w-4 text-cyan-300" />
                        {isExpired ? 'Expired on' : 'Expires on'} {formatRewardDate(selectedReward.expiresAt)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="flex items-center gap-3 text-sm font-semibold text-white">
                        <FileText className="h-4 w-4 text-cyan-300" />
                        Offer details
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {card.description || 'No extra offer details are available right now.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
