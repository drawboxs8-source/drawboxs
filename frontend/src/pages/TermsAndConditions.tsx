import { motion } from 'motion/react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { FileText } from 'lucide-react';

export default function TermsAndConditions() {
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
              <FileText className="w-10 h-10 text-cyan-500" /> Terms and Conditions
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
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">1. Agreement to Terms</h2>
                <p>By accessing our app, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials on Drawboxs's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>modify or copy the materials;</li>
                  <li>use the materials for any commercial purpose or for any public display;</li>
                  <li>attempt to reverse engineer any software contained on Drawboxs's Website;</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">3. Limitations</h2>
                <p>In no event shall Drawboxs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Drawboxs's Website, even if Drawboxs or an authorized representative of this Website has been notified orally or in writing of the possibility of such damage.</p>
              </section>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
