"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Search, Calendar, MapPin, BedDouble, 
  CheckCircle2, Loader2, ArrowLeft, IndianRupee,
  Clock, History, Hotel, ExternalLink
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────
interface Booking {
  id: number;
  name: string;
  phone?: string;
  email: string;
  location: string;
  hotel_name?: string;
  check_in: string;
  check_out: string;
  room_type?: string;
  total_price?: number;
  status?: string;
  created_at?: string;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ─── Booking Card ─────────────────────────────────────────────
function BookingListItem({ booking }: { booking: Booking }) {
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] shadow-sm p-6 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">{booking.hotel_name || "General Booking"}</h3>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-1">
              <MapPin className="w-3 h-3 text-sky-500" />
              {booking.location}
            </div>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${statusColors[booking.status || "confirmed"]}`}>
          {booking.status || "confirmed"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[var(--border)] mb-4">
        <div className="space-y-1">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Check-in</p>
          <p className="text-sm font-medium">{fmt(booking.check_in)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Check-out</p>
          <p className="text-sm font-medium">{fmt(booking.check_out)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Nights</p>
          <p className="text-sm font-medium">{nights} Night(s)</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Total Price</p>
          <p className="text-sm font-bold text-sky-500">₹{booking.total_price?.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Clock className="w-3 h-3" />
          Booked on {fmt(booking.created_at || new Date().toISOString())}
        </div>
        <Link 
          href="/cancel-booking"
          className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
        >
          Manage / Cancel <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [searchedEmail, setSearchedEmail] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://final-project-em3w.onrender.com/api";
    try {
      const { data } = await axios.get(`${apiUrl}/bookings/by-email?email=${encodeURIComponent(email.trim())}`);
      setBookings(data.data || []);
      setSearchedEmail(email.trim());
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to find bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="bg-sky-600 dark:bg-sky-900/40 py-16 text-center text-white px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h1 className="font-display text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-sky-100 max-w-md mx-auto text-sm">
            Enter your email to view your complete booking history and stay details.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border)] shadow-sm mb-10"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your booking email"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
            <button
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Searching..." : "View History"}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {bookings !== null && (
            <motion.div
              key={searchedEmail}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="font-bold text-[var(--text-primary)]">
                  Results for <span className="text-sky-500">{searchedEmail}</span>
                </h2>
                <button 
                  onClick={() => { setBookings(null); setEmail(""); }}
                  className="text-xs text-[var(--text-secondary)] flex items-center gap-1 hover:text-sky-500 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> New Search
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)]">
                  <div className="text-5xl mb-4 text-gray-300">📭</div>
                  <h3 className="text-xl font-bold mb-1">No bookings found</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6">We couldn't find any reservations linked to this email.</p>
                  <Link href="/accommodation" className="btn-primary">Book Your First Trip</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <BookingListItem key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
