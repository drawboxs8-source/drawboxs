import { motion } from 'motion/react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <div className="pt-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-10 h-10 text-cyan-500" /> Privacy Policy
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-8 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">1. Introduction</h2>
                <p>Welcome to Drawboxs. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">2. Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                  <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                  <li><strong>Financial Data:</strong> includes payment details necessary for withdrawals/deposits.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">3. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                  <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                  <li>Where we need to comply with a legal obligation.</li>
                </ul>
              </section>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
