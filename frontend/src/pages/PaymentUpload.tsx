import { motion } from 'motion/react';
import {
  Upload,
  Clock
} from 'lucide-react';

import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

import { useState } from 'react';
import { API } from "../services/api";
import toast from "react-hot-toast";

export default function PaymentUpload() {

  const [uploadedFile, setUploadedFile] =
    useState<any>(null);

  const [status, setStatus] =
    useState<'idle' | 'pending'>('idle');

  // 👉 PLAN DETAILS (Pricing page nundi pass cheyyachu later)
  const planName = "Starter";
  const planDuration = 1;
  const amount = 199;

  // FILE CHANGE
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    setUploadedFile({
      file,
      preview: URL.createObjectURL(file)
    });
  };

  // SUBMIT
  const handleSubmit = async () => {

    if (!uploadedFile?.file) {
      toast.error("Upload screenshot first");
      return;
    }

    const formData = new FormData();

    formData.append(
      "screenshot",
      uploadedFile.file
    );

    formData.append(
      "planName",
      planName
    );

    formData.append(
      "planDuration",
      String(planDuration)
    );

    formData.append(
      "amount",
      String(amount)
    );

    try {

      const token =
        localStorage.getItem("token");

      await API.post(
        "/payment/upload",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      toast.success(
        "Payment submitted"
      );

      setStatus("pending");

    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Upload failed"
      );
    }
  };

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
            <h1 className="text-4xl font-bold mb-2">
              Upload Payment Screenshot
            </h1>
          </motion.div>

          <GlassCard className="p-8">

            {status === "idle" && (

              !uploadedFile ? (

                <label
                  htmlFor="upload"
                  className="flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 rounded-3xl cursor-pointer"
                >
                  <input
                    type="file"
                    id="upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <Upload className="w-10 h-10 mb-4" />
                  Upload Screenshot

                </label>

              ) : (

                <div className="space-y-6">

                  <img
                    src={uploadedFile.preview}
                    className="rounded-2xl"
                  />

                  <GlowButton
                    onClick={handleSubmit}
                    className="w-full"
                  >
                    Submit Payment
                  </GlowButton>

                </div>
              )
            )}

            {status === "pending" && (

              <div className="text-center py-12">

                <Clock className="w-12 h-12 mx-auto mb-4" />

                <h3 className="text-xl font-bold">
                  Verification Pending
                </h3>

              </div>
            )}

          </GlassCard>
        </div>
      </div>
    </div>
  );
}
