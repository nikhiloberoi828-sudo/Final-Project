"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Mountain, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const { login } = useAuth();

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "", rememberMe: false });
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const getStrength = (pw: string) => {
    if (!pw) return { pct: 0, label: "", color: "bg-gray-600" };
    if (pw.length < 6) return { pct: 33, label: "Weak", color: "bg-red-500" };
    if (pw.length < 10) return { pct: 66, label: "Medium", color: "bg-yellow-400" };
    return { pct: 100, label: "Strong", color: "bg-emerald-500" };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return toast.error("Please fill all fields");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 🎉`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) return toast.error("Please fill all fields");
    if (signupData.password !== signupData.confirmPassword) return toast.error("Passwords do not match");
    if (signupData.password.length < 6) return toast.error("Password must be at least 6 characters");
    setSignupLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupData.name, email: signupData.email, password: signupData.password }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome, ${data.user.name.split(" ")[0]}! 🏔️`);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  const strength = getStrength(signupData.password);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md z-10"
          >
            {/* Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 rounded-[28px] opacity-60 blur-sm" />

            <div className="relative bg-gray-950/95 backdrop-blur-2xl rounded-[26px] overflow-hidden shadow-2xl border border-white/10">
              {/* Header banner */}
              <div className="relative bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 px-8 pt-8 pb-12 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-3 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
                  <div className="absolute -bottom-6 left-6 w-48 h-24 rounded-full bg-sky-300/20 blur-2xl" />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Mountain className="w-4.5 h-4.5 text-white" />
                      </div>
                      <span className="font-bold text-white text-sm tracking-wide">Himachal Explorer</span>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/80 hover:bg-white/25 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {tab === "login" ? "Welcome back" : "Create account"}
                  </h2>
                  <p className="text-sky-200 text-sm mt-1">
                    {tab === "login" ? "Log in to manage your bookings" : "Join 10,000+ Himalayan travellers"}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex -mt-5 mx-6 rounded-2xl bg-gray-900/80 border border-white/10 overflow-hidden relative z-10">
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3 text-sm font-semibold transition-all ${
                      tab === t
                        ? "bg-sky-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {t === "login" ? "Log In" : "Sign Up"}
                  </button>
                ))}
              </div>

              {/* Forms */}
              <div className="px-8 py-6">
                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      {/* Email */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type={showLoginPw ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                          />
                          <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                            {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember + forgot */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={loginData.rememberMe}
                            onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                          Remember me
                        </label>
                        <button
                          type="button"
                          onClick={() => { onClose(); window.location.href = "/forgot-password"; }}
                          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-60 mt-2"
                      >
                        {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Log In</span><ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSignup}
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            required
                            placeholder="Your full name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type={showSignupPw ? "text" : "password"}
                            required
                            placeholder="Min. 6 characters"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                          />
                          <button type="button" onClick={() => setShowSignupPw(!showSignupPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                            {showSignupPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {signupData.password && (
                          <div className="mt-2">
                            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                              <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.pct}%` }} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">{strength.label}</p>
                          </div>
                        )}
                      </div>

                      {/* Confirm password */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type={showSignupPw ? "text" : "password"}
                            required
                            placeholder="Repeat password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/70 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 transition-all ${
                              signupData.confirmPassword && signupData.confirmPassword !== signupData.password
                                ? "border-red-500 focus:ring-red-500/50"
                                : "border-white/10 focus:border-sky-500 focus:ring-sky-500/50"
                            }`}
                          />
                        </div>
                        {signupData.confirmPassword && signupData.confirmPassword !== signupData.password && (
                          <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-60 mt-2"
                      >
                        {signupLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Skip */}
                <div className="mt-5 text-center">
                  <button
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                  >
                    Skip for now — browse without login
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
