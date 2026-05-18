"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, Mail, Calendar, MapPin, XCircle, Loader2, Hotel } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface Booking {
  id: number;
  location: string;
  hotel_name?: string;
  check_in: string;
  check_out: string;
  room_type: string;
  status: string;
  total_price: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      toast.error("Please log in to access dashboard");
      router.push("/accommodation");
      return;
    }

    if (user) {
      fetchBookings(user.email);
    }
  }, [user, router]);

  const fetchBookings = async (email: string) => {
    try {
      const res = await fetch(`/api/bookings/by-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!user) return;
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setIsCancelling(bookingId);
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, email: user.email }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Booking cancelled successfully");
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b));
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-950 text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="mt-2 text-gray-400 text-sm">
              Manage your profile and travel bookings
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/25 font-semibold text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl">
              <div className="h-28 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              <div className="px-6 pb-6 relative">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg absolute -top-10">
                  <div className="w-full h-full rounded-full bg-sky-500/15 flex items-center justify-center text-sky-400">
                    <User className="w-8 h-8" />
                  </div>
                </div>
                <div className="pt-12">
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <Mail className="w-4 h-4 mr-3 text-sky-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-4 h-4 mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                      Status: Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bookings Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-6 h-6 text-sky-400" />
              Your Bookings
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-gray-900/20 backdrop-blur-md rounded-3xl p-10 text-center border border-white/10 border-dashed">
                <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
                  <MapPin className="w-8 h-8 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No bookings yet</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Explore destinations and book premium hotels to start your journey.</p>
                <button 
                  onClick={() => router.push('/accommodation')}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-sky-500/10 text-sm"
                >
                  Explore Hotels
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-gray-900/30 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg"
                  >
                    {/* Status indicator line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status.toLowerCase() === 'cancelled' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-sky-400" />
                            {booking.location}
                          </h3>
                          {booking.hotel_name && (
                            <p className="text-sm text-gray-400 flex items-center mt-1">
                              <Hotel className="w-4 h-4 mr-2 text-sky-400/70" />
                              {booking.hotel_name} ({booking.room_type})
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status.toLowerCase() === 'cancelled' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 bg-gray-900/50 p-3.5 rounded-xl border border-white/5">
                        <div>
                          <span className="block text-xs text-gray-500 mb-1">Check In</span>
                          <span className="font-semibold text-white">{new Date(booking.check_in).toLocaleDateString()}</span>
                        </div>
                        <div className="w-px bg-white/10"></div>
                        <div>
                          <span className="block text-xs text-gray-500 mb-1">Check Out</span>
                          <span className="font-semibold text-white">{new Date(booking.check_out).toLocaleDateString()}</span>
                        </div>
                        <div className="w-px bg-white/10 hidden sm:block"></div>
                        <div>
                          <span className="block text-xs text-gray-500 mb-1">Amount</span>
                          <span className="font-semibold text-sky-400 font-mono">₹{booking.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {booking.status.toLowerCase() !== 'cancelled' && (
                      <div className="flex sm:flex-col justify-end items-center sm:items-end border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={isCancelling === booking.id}
                          className="flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                          {isCancelling === booking.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Cancel Trip
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
