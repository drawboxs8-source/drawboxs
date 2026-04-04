import { motion } from 'motion/react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { AlertCircle } from 'lucide-react';

export default function Disclaimer() {
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
              <AlertCircle className="w-10 h-10 text-cyan-500" /> Disclaimer
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
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">General Disclaimer</h2>
                <p>The information provided by Drawboxs on this website and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site or our mobile application.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Earnings Disclaimer</h2>
                <p>Any earnings or income statements, or earnings or income examples, are only estimates of what we think you could earn. There is no assurance you'll do as well. If you rely upon our figures, you must accept the risk of not doing as well.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">External Links Disclaimer</h2>
                <p>The Site and our mobile application may contain (or you may be sent through the Site or our mobile application) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>
              </section>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
