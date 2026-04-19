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
    <div className="min-h-screen pb-20 font-sans bg-[#f3f7fb] text-slate-950">
      <Header />

      <div className="relative overflow-hidden pt-8 px-4 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-20 h-40 w-40 rounded-full bg-cyan-200/50 blur-3xl" />
          <div className="absolute right-[10%] top-12 h-48 w-48 rounded-full bg-amber-100/70 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Weekly Offers
                </div>
                <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
                    <Gift className="h-6 w-6 text-white" />
                  </span>
                  My Rewards
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Tap any coupon to view the uploaded offer details, coupon code, expiry date, and store link in
                  one readable reward screen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</div>
                  <div className="mt-1 text-2xl font-bold text-slate-950">{rewards.length}</div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-700">Unlocked</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-900">
                    {rewards.filter((reward) => reward.isUsed).length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {rewards.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center text-slate-500 shadow-sm">
              <Sparkles className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg font-semibold text-slate-950">No rewards assigned yet.</p>
              <p className="mt-2 text-sm text-slate-500">Wait for the admin to upload new weekly rewards.</p>
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
                    className={`group relative overflow-hidden rounded-[28px] border bg-white text-left shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 ${
                      isExpired
                        ? 'border-slate-200 opacity-65'
                        : 'border-slate-200 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_24px_60px_rgba(8,145,178,0.16)]'
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-50 to-transparent opacity-80" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between px-4 pt-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            isExpired
                              ? 'bg-red-50 text-red-700'
                              : isUsed
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isExpired ? 'Expired' : isUsed ? 'Unlocked' : 'Locked'}
                        </span>
                        {isUsed && !isExpired ? (
                          <span className="rounded-full bg-emerald-50 p-2 text-emerald-700">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        ) : null}
                      </div>

                      <div className="px-4 pt-4">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-inner">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.title || 'Reward'}
                              className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                              <Gift className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
                        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950">
                          {card.title || 'Untitled reward'}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {card.description || 'Reward details will appear here once the admin adds them.'}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Access</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">
                              {hasCode ? 'Coupon Code' : 'Direct Offer'}
                            </div>
                          </div>
                          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
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
          <div className="fixed inset-0 z-[2147483600] flex items-end justify-center bg-slate-900/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
            <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[32px] border border-slate-200 bg-white text-slate-950 shadow-[0_35px_120px_rgba(15,23,42,0.28)] sm:h-auto sm:max-h-[90vh] sm:rounded-[32px]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(selectedReward._id, e)}
                    className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-100">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
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
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Status</div>
                      <div className="mt-2 text-base font-semibold text-slate-950">
                        {isExpired ? 'Expired' : isUsed ? 'Unlocked' : 'Ready to unlock'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Code Type</div>
                      <div className="mt-2 text-base font-semibold text-slate-950">
                        {hasCode ? 'Coupon code' : 'No code needed'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Expires</div>
                      <div className="mt-2 text-base font-semibold text-slate-950">
                        {formatRewardDate(selectedReward.expiresAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-5 sm:p-6">
                  <div className="mb-6">
                    <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                      Reward details
                    </div>
                    <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                      {card.title || 'Untitled reward'}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                      {card.description || 'No detailed description has been added for this reward yet.'}
                    </p>
                  </div>

                  {isExpired ? (
                      <div className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-red-700">
                        This offer expired on {formatRewardDate(selectedReward.expiresAt)}.
                      </div>
                    ) : (
                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Coupon access</div>
                          <div className="mt-2 break-all text-2xl font-black tracking-[0.12em] text-slate-950">
                            {isUsed ? displayCode : '********'}
                          </div>
                        </div>
                        {isUsed && hasCode ? (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(displayCode || '');
                              toast.success('Coupon code copied!');
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {isUsed
                          ? 'Use this code at checkout, or tap the button below to open the offer page.'
                          : 'Unlock the reward first, then copy the code or open the retailer page.'}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {!isUsed ? (
                          <button
                            onClick={() => handleReveal(selectedReward._id)}
                            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                          >
                            Unlock Reward
                          </button>
                        ) : (
                          <button
                            onClick={() => openRewardLink(card.couponLink)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                          >
                            Open Offer
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => openRewardLink(card.couponLink)}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {isUsed ? 'Visit Store' : 'Preview Offer'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-950">
                        <Clock className="h-4 w-4 text-cyan-600" />
                        {isExpired ? 'Expired on' : 'Expires on'} {formatRewardDate(selectedReward.expiresAt)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-950">
                        <FileText className="h-4 w-4 text-cyan-600" />
                        Coupon description
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {card.description || 'No extra offer details are available right now.'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-950">
                        <ExternalLink className="h-4 w-4 text-cyan-600" />
                        URL link
                      </div>
                      {card.couponLink ? (
                        <button
                          onClick={() => openRewardLink(card.couponLink)}
                          className="mt-2 break-all text-left text-sm font-semibold leading-6 text-blue-700 underline-offset-4 hover:underline"
                        >
                          {card.couponLink}
                        </button>
                      ) : (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          No URL was uploaded for this coupon.
                        </p>
                      )}
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
