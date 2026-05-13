"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home, MessageSquare } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-3">
          Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-4 py-3.5 rounded-xl transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-4 py-3.5 rounded-xl transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Support
            </Link>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-10 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-500 mb-2">Error Details (Dev Only):</p>
            <pre className="text-[10px] text-[var(--text-secondary)] font-mono">
              {error.message}
              {"\n"}
              {error.stack}
            </pre>
          </div>
        )}
      </motion.div>
    </div>
  );
}
