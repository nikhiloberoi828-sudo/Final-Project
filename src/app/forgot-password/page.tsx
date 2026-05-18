"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for forgot password
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error("Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-10 border border-white/10"
      >
        {!isSent ? (
          <>
            <div className="text-center">
              <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-white/10 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-70 shadow-lg shadow-sky-500/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
            <p className="text-gray-400 text-sm mb-8">
              We've sent password reset instructions to <span className="font-semibold text-white">{email}</span>
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Didn't receive the email? Click to resend
            </button>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
