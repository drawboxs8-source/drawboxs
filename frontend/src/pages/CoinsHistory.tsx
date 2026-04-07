import { motion } from "motion/react";
import {
  Coins,
  Filter,
  TrendingUp,
  Download,
  Trash2
} from "lucide-react";

import toast from "react-hot-toast";

import Header from "../components/Header";
import GlassCard from "../components/GlassCard";

import { useState, useEffect } from "react";
import { API } from "../services/api";

export default function CoinsHistory() {

  const [filter, setFilter] =
    useState("all");

  const [transactions,
    setTransactions] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

useEffect(() => {

  API.get("/history/coins-history")
    .then(res => {
      setTransactions(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });

}, []);
  /// Filter
  const filteredTransactions =
    transactions.filter(t => {
      if (filter === "all")
        return true;
      return t.type === filter;
    });

  const handleDelete = async (type: string, id: string) => {
    try {
      await API.delete(`/history/coins-history/${type}/${id}`);
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success("History entry removed");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove entry");
    }
  };

  return (
    <div className="min-h-screen pb-20">

      <Header />

      <div className="pt-8 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Coins History
            </h1>

            <p className="text-slate-600 dark:text-slate-400">
              Track all earnings & withdrawals
            </p>
          </motion.div>

          {/* Filter */}
          <GlassCard className="p-6 mb-8">

            <div className="flex items-center gap-4">

              <Filter className="w-5 h-5" />

              <select
                value={filter}
                onChange={e =>
                  setFilter(e.target.value)
                }
                className="px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60"
              >
                <option value="all">
                  All
                </option>

                <option value="earn">
                  Earnings
                </option>

                <option value="withdraw">
                  Withdrawals
                </option>

              </select>

            </div>

          </GlassCard>

          {/* Table */}
          <GlassCard className="p-6">

            <h3 className="text-xl font-bold mb-6">
              Transaction History
            </h3>

            {loading ? (

              <div className="text-center py-10">
                Loading...
              </div>

            ) : filteredTransactions.length === 0 ? (

              <div className="text-center py-10 text-slate-500">
                No transactions yet
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead>
                    <tr className="border-b">

                      <th className="text-left py-3">
                        Date
                      </th>

                      <th className="text-left py-3">
                        Description
                      </th>

                      <th className="text-left py-3">
                        Type
                      </th>

                      <th className="text-right py-3">
                        Coins
                      </th>

                      <th className="text-center py-3">
                        Status
                      </th>

                      <th className="text-center py-3">
                        Delete
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredTransactions.map(
                      (t, i) => (

                        <motion.tr
                          key={t.id}
                          initial={{
                            opacity: 0,
                            x: -20
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          transition={{
                            delay: i * 0.05
                          }}
                          className="border-b hover:bg-white/10"
                        >

                          {/* Date */}
                          <td className="py-4">

                            {new Date(
                              t.date
                            ).toDateString()}

                          </td>

                          {/* Desc */}
                          <td className="py-4">

                            {t.description}

                          </td>

                          {/* Type */}
                          <td className="py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                t.type === "earn"
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-orange-500/20 text-orange-600"
                              }`}
                            >

                              {t.type === "earn"
                                ? "Earn"
                                : "Withdraw"}

                            </span>

                          </td>

                          {/* Coins */}
                          <td className="py-4 text-right font-bold">

                            <span
                              className={
                                t.coins.startsWith("+")
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }
                            >
                              {t.coins}
                            </span>

                          </td>

                          {/* Status */}
                          <td className="py-4 text-center">

                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                t.status === "Paid" ||
                                t.status === "Completed"
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-orange-500/20 text-orange-600"
                              }`}
                            >
                              {t.status}
                            </span>

                          </td>

                          {/* Delete Action */}
                          <td className="py-4 text-center">
                            <button
                              onClick={() => handleDelete(t.type, t.id)}
                              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors font-semibold text-sm shadow-md"
                              title="Delete from history"
                            >
                              Delete
                            </button>
                          </td>

                        </motion.tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </GlassCard>

        </div>
      </div>
    </div>
  );
}
