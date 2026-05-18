"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { label: "", color: "bg-transparent", width: "w-0" };
    if (password.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (password.length < 10) return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Account created successfully!");
        login(data.user, data.token);
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to sign up");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-10 border border-white/10"
      >
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
            Join Himachal Explorer
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Start your Himalayan journey today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-white/10 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-10 px-3 py-3 border border-white/10 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.color} transition-all duration-300 ease-out`}
                    style={{ width: strength.label === "Weak" ? "33%" : strength.label === "Medium" ? "66%" : "100%" }}
                  ></div>
                </div>
                <p className="text-xs text-right font-medium text-gray-400">
                  {strength.label}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-500" />
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-white/10 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-70 shadow-lg shadow-sky-500/20 animate-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
