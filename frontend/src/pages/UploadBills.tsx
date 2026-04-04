import { motion } from 'motion/react';
import { Upload, X, CheckCircle, FileText, Clock } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useState } from 'react';

export default function UploadBills() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: number; name: string; size: string; status: string }>>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      status: 'uploading',
    }));
    
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    
    // Simulate upload completion
    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          newFiles.find((f) => f.id === file.id) ? { ...file, status: 'completed' } : file
        )
      );
    }, 2000);
  };

  const removeFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const dailyLimit = { used: 8, total: 15 };
  const percentage = (dailyLimit.used / dailyLimit.total) * 100;

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
            <h1 className="text-4xl font-bold mb-2">Upload Bills</h1>
            <p className="text-slate-600 dark:text-slate-400">Upload your shopping bills to earn scratch cards</p>
          </motion.div>

          {/* Daily Limit Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard neonBorder className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Daily Upload Limit</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gold Plan</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                    {dailyLimit.used}/{dailyLimit.total}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dailyLimit.total - dailyLimit.used} remaining</p>
                </div>
              </div>
              <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard className="p-8">
              <form
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className="relative"
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center min-h-[300px] border-3 border-dashed rounded-3xl cursor-pointer transition-all ${
                    dragActive
                      ? 'border-cyan-500 dark:border-violet-500 bg-cyan-500/10 dark:bg-violet-500/10'
                      : 'border-slate-300 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-violet-400'
                  }`}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center mb-6 shadow-lg"
                    animate={dragActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: dragActive ? Infinity : 0 }}
                  >
                    <Upload className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Drop your bills here</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">or click to browse</p>
                  <p className="text-sm text-slate-500">Supports: JPG, PNG, PDF (Max 5MB each)</p>
                </label>
              </form>

              {uploadedFiles.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-bold mb-4">Uploaded Files</h3>
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{file.name}</div>
                        <div className="text-sm text-slate-500">{file.size}</div>
                      </div>
                      {file.status === 'uploading' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Clock className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-semibold">Uploading...</span>
                        </div>
                      )}
                      {file.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-semibold">Completed</span>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {uploadedFiles.filter((f) => f.status === 'completed').length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <GlowButton variant="primary" className="w-full">
                    Submit {uploadedFiles.filter((f) => f.status === 'completed').length} Bill(s) & Get Scratch Cards
                  </GlowButton>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Upload Guidelines</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Bills must be clear and readable with visible merchant name and amount</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Accepted formats: JPG, PNG, PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Maximum file size: 5MB per file</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Bills will be verified within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Duplicate or fake bills will result in account suspension</span>
                </li>
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
