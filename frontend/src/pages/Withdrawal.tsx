import { motion } from 'motion/react';
import { Wallet, IndianRupee, Coins, AlertCircle, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState } from 'react';
import { useEffect } from "react";
import { API } from "../services/api";
import toast from "react-hot-toast";



export default function Withdrawal() {
  const [coinAmount, setCoinAmount] = useState('');
  const conversionRate = 0.2; // 1 coin = ₹0.20
  const minWithdrawal = 5000; // minimum 5000 coins
  const [availableCoins, setAvailableCoins] = useState(0);
interface WithdrawalType {
  _id: string;
  coins: number;
  rupees: number;
  status: string;
  createdAt: string;
}

const [history, setHistory] =
  useState<WithdrawalType[]>([]);


  const rupeeAmount = coinAmount ? (parseFloat(coinAmount) * conversionRate).toFixed(2) : '0.00';
  const isValidAmount = coinAmount && parseFloat(coinAmount) >= minWithdrawal && parseFloat(coinAmount) <= availableCoins;


  useEffect(() => {
  API.get("/user/me").then(res => {
    setAvailableCoins(res.data.coins);
  });

  API.get("/withdrawals").then(res => {
    setHistory(res.data);
  });
}, []);
const handleWithdraw = async () => {
  if (!isValidAmount) return;

  await API.post("/withdrawal/request", {
    coins: coinAmount
  });

  toast.error("Withdrawal Requested");

  setCoinAmount("");

  /// Refresh wallet
  const res = await API.get("/user/me");
  setAvailableCoins(res.data.coins);
};


  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="pt-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Withdraw Coins</h1>
            <p className="text-slate-600 dark:text-slate-400">Convert your coins to real money</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Balance Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard neonBorder className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Available Balance</div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                        {availableCoins.toLocaleString()} Coins
                      </div>
                      <div className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                        ≈ ₹{(availableCoins * conversionRate).toLocaleString()}
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Coins className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Converter */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Convert Coins to Rupees</h2>

                  <div className="space-y-6">
                    {/* Coin Input */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Enter Coin Amount</label>
                      <div className="relative">
                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                          type="number"
                          placeholder="5000"
                          value={coinAmount}
                          onChange={(e) => setCoinAmount(e.target.value)}
                          className="w-full pl-14 pr-4 py-4 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-violet-500 outline-none transition-all text-lg font-semibold"
                          min={minWithdrawal}
                          max={availableCoins}
                        />
                        <button
                          onClick={() => setCoinAmount(availableCoins.toString())}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-cyan-500 dark:bg-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                          Max
                        </button>
                      </div>
                    </div>

                    {/* Conversion Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Rupee Output */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">You Will Receive</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                          type="text"
                          value={rupeeAmount}
                          readOnly
                          className="w-full pl-14 pr-4 py-4 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/50 text-lg font-semibold cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Conversion Rate</p>
                        <p className="text-slate-600 dark:text-slate-400">
                          1 Coin = ₹{conversionRate.toFixed(2)} • Minimum withdrawal: {minWithdrawal.toLocaleString()} coins
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <GlowButton
                      variant="primary"
                      className="w-full"
                     onClick={handleWithdraw}
                    >
                      {isValidAmount ? 'Request Withdrawal' : 'Enter Valid Amount'}
                    </GlowButton>

                    {coinAmount && parseFloat(coinAmount) < minWithdrawal && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        Minimum withdrawal is {minWithdrawal.toLocaleString()} coins
                      </p>
                    )}
                    {coinAmount && parseFloat(coinAmount) > availableCoins && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        Insufficient balance
                      </p>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Withdrawal Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Enter Amount</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Minimum 5,000 coins required
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Admin Review</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Request reviewed within 24 hours
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Payment Processing</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Money transferred to your bank
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
{/* Withdrawal History */}
<motion.div
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.4 }}
>
  <GlassCard className="p-6">
    <h3 className="text-xl font-bold mb-4">
      Recent Withdrawals
    </h3>

    <div className="space-y-4">

      {history.length === 0 ? (

        <div className="text-center py-6 text-slate-500">
          No withdrawals yet
        </div>

      ) : (

        history.map((withdrawal) => (

          <div
            key={withdrawal._id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
          >

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                withdrawal.status === "Paid"
                  ? "bg-green-500/20 text-green-600"
                  : "bg-orange-500/20 text-orange-600"
              }`}
            >
              {withdrawal.status === "Paid"
                ? <CheckCircle className="w-5 h-5" />
                : <Clock className="w-5 h-5" />
              }
            </div>

            {/* Amount + Date */}
            <div className="flex-1">

              <div className="font-semibold">
                ₹{withdrawal.rupees}
              </div>

              <div className="text-sm text-slate-500">
                {new Date(
                  withdrawal.createdAt 
                ).toDateString()}
              </div>

            </div>

            {/* Status */}
            <div
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                withdrawal.status === "Paid"
                  ? "bg-green-500/20 text-green-600"
                  : "bg-orange-500/20 text-orange-600"
              }`}
            >
              {withdrawal.status}
            </div>

          </div>

        ))

      )}

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
