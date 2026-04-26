import { motion } from 'motion/react';
import { Users, FileCheck, CreditCard, Wallet, CheckCircle, X, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState, useEffect } from 'react';
import { API } from '../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'screenshots' | 'withdrawals' | 'rewards' | 'settings'>('approvals');
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    pendingWithdrawals: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Rewards Upload State
  const [rewardData, setRewardData] = useState({
    title: "",
    description: "",
    couponCode: "",
    couponLink: "",
    expiryDays: 7
  });
  const [rewardImage, setRewardImage] = useState<File | null>(null);
  const [uploadingReward, setUploadingReward] = useState(false);

  // Admin Settings State
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Please enter a new password");

    const toastId = toast.loading("Updating password...");
    setChangingPassword(true);
    try {
      await API.put("/admin/change-password", { newPassword });
      toast.dismiss(toastId);
      toast.success("Password updated successfully!");
      setNewPassword("");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Loading admin data...");

    try {
      const [usersRes, paymentsRes, withdrawalsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/payments"),
        API.get("/admin/withdrawals")
      ]);

      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
      setWithdrawals(withdrawalsRes.data);
      
      // Calculate stats
      const pendingUsers = usersRes.data.filter((u: any) => !u.isApproved).length;
      const pendingPay = paymentsRes.data.filter((p: any) => p.status !== "Approved").length;
      const pendingWith = withdrawalsRes.data.filter((w: any) => w.status !== "Paid").length;

      setStats({
        totalUsers: usersRes.data.length,
        approvedUsers: usersRes.data.filter((u: any) => u.isApproved).length,
        pendingApprovals: pendingUsers,
        pendingPayments: pendingPay,
        pendingWithdrawals: pendingWith
      });

      toast.dismiss(loadingToast);
      toast.success("Data loaded successfully!");

    } catch (err: any) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Failed to load admin data");
    }

    setLoading(false);
  };

  const handleApproveUser = async (userId: string) => {
    const approveToast = toast.loading("Approving user...");

    try {
      await API.put(`/admin/approve-user/${userId}`);
      toast.dismiss(approveToast);
      toast.success("User approved successfully!");
      fetchData();
    } catch (err) {
      toast.dismiss(approveToast);
      toast.error("Failed to approve user");
    }
  };
  const handleRejectUser = async (userId: string) => {

  const toastId = toast.loading("Rejecting user...");

  try {
    await API.put(`/admin/reject-user/${userId}`);

    toast.dismiss(toastId);
    toast.success("User rejected");

    fetchData();

  } catch {
    toast.dismiss(toastId);
    toast.error("Reject failed");
  }
};

  const handleToggleUpload = async (userId: string, currentStatus: boolean) => {
    const toggleToast = toast.loading("Updating permissions...");

    try {
      const res = await API.put(`/admin/toggle-upload/${userId}`);
      toast.dismiss(toggleToast);
      toast.success(res.data.message);
      fetchData();
    } catch (err) {
      toast.dismiss(toggleToast);
      toast.error("Failed to update permissions");
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    const approveToast = toast.loading("Approving payment...");

    try {
      await API.put(`/admin/approve-payment/${paymentId}`);
      toast.dismiss(approveToast);
      toast.success("Payment approved! Plan activated.");
      fetchData();
    } catch (err) {
      toast.dismiss(approveToast);
      toast.error("Failed to approve payment");
    }
  };

  const handleRejectPayment = async (paymentId: string) => {

  const toastId = toast.loading("Rejecting payment...");

  try {
    await API.put(`/admin/reject-payment/${paymentId}`);

    toast.dismiss(toastId);
    toast.success("Payment rejected");

    fetchData();

  } catch {
    toast.dismiss(toastId);
    toast.error("Reject failed");
  }
};

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    const approveToast = toast.loading("Processing withdrawal...");

    try {
      await API.put(`/admin/approve-withdrawal/${withdrawalId}`);
      toast.dismiss(approveToast);
      toast.success("Withdrawal processed successfully!");
      fetchData();
    } catch (err) {
      toast.dismiss(approveToast);
      toast.error("Failed to process withdrawal");
    }
  };
  const handleRejectWithdrawal = async (id: string) => {

  const toastId = toast.loading("Rejecting withdrawal...");

  try {
    await API.put(`/admin/reject-withdrawal/${id}`);

    toast.dismiss(toastId);
    toast.success("Withdrawal rejected");

    fetchData();

  } catch {
    toast.dismiss(toastId);
    toast.error("Reject failed");
  }
};

  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardImage) {
      toast.error("Please select an image");
      return;
    }

    const toastId = toast.loading("Uploading reward...");
    setUploadingReward(true);

    try {
      const formData = new FormData();
      formData.append("title", rewardData.title);
      formData.append("description", rewardData.description);
      formData.append("couponCode", rewardData.couponCode);
      formData.append("couponLink", rewardData.couponLink);
      formData.append("expiryDays", rewardData.expiryDays.toString());
      formData.append("image", rewardImage);

      await API.post("/admin/rewards/add-reward", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.dismiss(toastId);
      toast.success("Reward uploaded successfully!");
      setRewardData({ title: "", description: "", couponCode: "", couponLink: "", expiryDays: 7 });
      setRewardImage(null);
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to upload reward");
    } finally {
      setUploadingReward(false);
    }
  };



  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      change: `${stats.approvedUsers} approved`,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: FileCheck,
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: 'User registrations',
      color: 'from-orange-400 to-red-500',
    },
    {
      icon: CreditCard,
      label: 'Payments Pending',
      value: stats.pendingPayments,
      change: 'Screenshots to verify',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Wallet,
      label: 'Withdrawals Pending',
      value: stats.pendingWithdrawals,
      change: 'Ready to process',
      color: 'from-green-400 to-emerald-500',
    },
  ];

  const pendingUsers = users.filter((u: any) => !u.isApproved);
  const pendingScreenshots = payments.filter((p: any) => p.status !== "Approved");
  const pendingWithdrawalsList = withdrawals.filter((w: any) => w.status !== "Paid");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="pt-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage users, payments, and withdrawals</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
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
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.change}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <GlassCard className="p-2 overflow-hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
                <button
                  onClick={() => setActiveTab('approvals')}
                  className={`flex-1 shrink-0 whitespace-nowrap px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'approvals'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                      : 'hover:bg-white/20 dark:hover:bg-slate-800/20'
                  }`}
                >
                  User Approvals ({pendingUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab('screenshots')}
                  className={`flex-1 shrink-0 whitespace-nowrap px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'screenshots'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                      : 'hover:bg-white/20 dark:hover:bg-slate-800/20'
                  }`}
                >
                  Payment Screenshots ({pendingScreenshots.length})
                </button>
                <button
                  onClick={() => setActiveTab('withdrawals')}
                  className={`flex-1 shrink-0 whitespace-nowrap px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'withdrawals'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                      : 'hover:bg-white/20 dark:hover:bg-slate-800/20'
                  }`}
                >
                  Withdrawals ({pendingWithdrawalsList.length})
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`flex-1 shrink-0 whitespace-nowrap px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'rewards'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                      : 'hover:bg-white/20 dark:hover:bg-slate-800/20'
                  }`}
                >
                  Upload Reward
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 shrink-0 whitespace-nowrap px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg'
                      : 'hover:bg-white/20 dark:hover:bg-slate-800/20'
                  }`}
                >
                  Settings
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6">
              {activeTab === 'approvals' && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Pending User Approvals</h2>
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No pending user approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingUsers.map((user) => (
                        <div
                          key={user._id}
                          className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-bold text-lg">{user.name || 'N/A'}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{user.phone || 'N/A'}</div>
                                <div className="text-sm text-slate-500">{user.phone || 'N/A'}</div>
                                <div className="text-sm text-violet-600 dark:text-violet-300">
                                  Entered referral code: {user.usedReferralCode?.trim() ? user.usedReferralCode : 'None'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-sm text-slate-500">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                              <button 
                                onClick={() => handleApproveUser(user._id)}
                                className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectUser(user._id)}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All Users Section */}
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">All Users ({users.length})</h2>
                    {users.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No users found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {users.map((user) => (
                          <div
                            key={user._id}
                            className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-bold text-lg flex items-center gap-2">
                                    {user.name || 'N/A'}
                                    {user.isApproved && (
                                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-600">
                                        Approved
                                      </span>
                                    )}
                                    {user.planPurchased && (
                                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-600">
                                        {user.planName || 'Premium'}
                                      </span>
                                    )}
                                  </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{user.phone || 'N/A'}</div>
                                <div className="text-sm text-slate-500">
                                  Coins: {user.coins || 0} | Bills: {user.totalBillsUploaded || 0}
                                </div>
                                <div className="text-sm text-violet-600 dark:text-violet-300">
                                  Entered referral code: {user.usedReferralCode?.trim() ? user.usedReferralCode : 'None'}
                                </div>
                              </div>
                            </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleToggleUpload(user._id, user.canUploadBills)}
                                  className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                                    user.canUploadBills
                                      ? 'bg-green-500 text-white hover:bg-green-600'
                                      : 'bg-slate-500 text-white hover:bg-slate-600'
                                  }`}
                                >
                                  {user.canUploadBills ? (
                                    <>
                                      <ToggleRight className="w-5 h-5" />
                                      Upload: ON
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft className="w-5 h-5" />
                                      Upload: OFF
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleRejectUser(user._id)}
                                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                                  title="Delete User"
                                >
                                  <X className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'screenshots' && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Payment Screenshots to Verify</h2>
                  {pendingScreenshots.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No pending payment screenshots</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingScreenshots.map((payment) => (
                        <div
                          key={payment._id}
                          className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-lg">
                                  {payment.userId?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {payment.userId?.email || "N/A"}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {payment.planName || 'N/A'} Plan • ₹{payment.amount || 0}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setSelectedScreenshot(payment.screenshot)}
                                className="px-4 py-2 rounded-xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button 
                                onClick={() => handleApprovePayment(payment._id)}
                                className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectPayment(payment._id)}

                                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'withdrawals' && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Pending Withdrawal Requests</h2>
                  {pendingWithdrawalsList.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No pending withdrawal requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingWithdrawalsList.map((withdrawal) => (
                        <div
                          key={withdrawal._id}
                          className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-lg">
                                  {withdrawal.userId?.name || 'Unknown User'}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {withdrawal.coins || 0} coins → ₹{withdrawal.amount || 0}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {withdrawal.bankName || 'N/A'} • {withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleApproveWithdrawal(withdrawal._id)}
                                className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Process Payment
                              </button>
                              <button 
                                onClick={() => handleRejectWithdrawal(withdrawal._id)}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'rewards' && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Upload Weekly Reward</h2>
                  <form onSubmit={handleRewardSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Title</label>
                      <input
                        type="text"
                        value={rewardData.title}
                        onChange={(e) => setRewardData({ ...rewardData, title: e.target.value })}
                        placeholder="e.g. 50% Off Swiggy"
                        required
                        className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea
                        value={rewardData.description}
                        onChange={(e) => setRewardData({ ...rewardData, description: e.target.value })}
                        placeholder="Details about the reward..."
                        required
                        className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 outline-none h-24"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Coupon Code</label>
                        <input
                          type="text"
                          value={rewardData.couponCode}
                          onChange={(e) => setRewardData({ ...rewardData, couponCode: e.target.value })}
                          placeholder="SWIGGY50"
                          className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Reward URL/Link</label>
                        <input
                          type="url"
                          value={rewardData.couponLink}
                          onChange={(e) => setRewardData({ ...rewardData, couponLink: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Valid For (Days)</label>
                        <input
                          type="number"
                          value={rewardData.expiryDays}
                          onChange={(e) => setRewardData({ ...rewardData, expiryDays: parseInt(e.target.value) || 7 })}
                          min="1"
                          required
                          className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Reward Image</label>
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 text-center">
                        <input
                          type="file"
                          id="reward-upload"
                          accept="image/*"
                          onChange={(e) => setRewardImage(e.target.files ? e.target.files[0] : null)}
                          className="hidden"
                          required
                        />
                        <label htmlFor="reward-upload" className="cursor-pointer">
                          {rewardImage ? (
                            <div className="text-green-600 font-semibold">{rewardImage.name}</div>
                          ) : (
                            <div className="text-slate-500">Click to upload image</div>
                          )}
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadingReward}
                      className="w-full py-3 rounded-2xl shadow-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {uploadingReward ? "Uploading..." : "Upload Reward"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold mb-4">Change Admin Password</h3>
                    <form onSubmit={handleAdminPasswordChange} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter strong new password"
                          required
                          className="w-full px-4 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="w-full py-3 rounded-2xl shadow-lg font-bold text-white bg-gradient-to-r from-red-500 to-orange-600 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                      >
                        {changingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </GlassCard>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
          onClick={() => setSelectedScreenshot(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Payment Screenshot</h3>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <img 
                src={selectedScreenshot} 
                alt="Payment Screenshot" 
                className="w-full rounded-2xl"
              />
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
