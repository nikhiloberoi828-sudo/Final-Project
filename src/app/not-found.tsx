"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mountain, Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg"
      >
        {/* Mountain icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-sky-500/30"
        >
          <Mountain className="w-12 h-12 text-white" />
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-9xl md:text-[10rem] font-bold leading-none"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
            Lost in the Himalayas?
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-sm mx-auto">
            The trail you&apos;re looking for doesn&apos;t exist or has been moved to a higher summit.
            Let us guide you back.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            id="notFoundHome"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-sky-500/25"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/destinations"
            id="notFoundDestinations"
            className="inline-flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-sky-500 hover:text-sky-500 font-semibold px-8 py-3.5 rounded-full transition-all"
          >
            <Search className="w-4 h-4" />
            Explore Destinations
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <p className="text-xs text-[var(--text-secondary)] mb-4 uppercase tracking-widest font-medium">
            Popular Pages
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: "/accommodation", label: "Accommodation" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact" },
              { href: "/about", label: "About" },
              { href: "/how-to-reach", label: "How to Reach" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-sky-500 hover:border-sky-300 px-4 py-2 rounded-full transition-all"
              >
                {link.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
