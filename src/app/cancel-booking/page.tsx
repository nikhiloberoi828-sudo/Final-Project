"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Search, Calendar, MapPin, BedDouble, XCircle,
  AlertTriangle, CheckCircle2, Loader2, ArrowLeft, IndianRupee,
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

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

// ─── BookingCard ──────────────────────────────────────────────
function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (b: Booking) => void;
}) {
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
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-base leading-tight">
            {booking.hotel_name || "Hotel"}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-secondary)]">
            <MapPin className="w-3 h-3 text-sky-500" />
            {booking.location}
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 ${
            statusColors[booking.status || "confirmed"] ?? statusColors.confirmed
          }`}
        >
          {booking.status || "confirmed"}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            <span className="block text-xs text-gray-400">Check-in</span>
            {fmt(booking.check_in)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            <span className="block text-xs text-gray-400">Check-out</span>
            {fmt(booking.check_out)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <BedDouble className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            <span className="block text-xs text-gray-400">Room</span>
            {booking.room_type || "Standard Room"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <IndianRupee className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            <span className="block text-xs text-gray-400">Total ({nights}n)</span>
            {booking.total_price
              ? `₹${booking.total_price.toLocaleString()}`
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Cancel button */}
      <button
        onClick={() => onCancel(booking)}
        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-[1.01]"
        id={`cancel-booking-${booking.id}`}
      >
        <XCircle className="w-4 h-4" />
        Cancel This Booking
      </button>
    </motion.div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────
function ConfirmModal({
  booking,
  onConfirm,
  onClose,
  loading,
}: {
  booking: Booking;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-[var(--bg-secondary)] rounded-3xl shadow-2xl p-8 border border-[var(--border)]"
        id="cancelConfirmModal"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
            Cancel Booking?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Are you sure you want to cancel your booking at{" "}
            <strong className="text-[var(--text-primary)]">
              {booking.hotel_name || "this hotel"}
            </strong>
            ?{" "}
            <span className="text-red-500 font-medium">This cannot be undone.</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            id="cancelModalGoBack"
            className="flex-1 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            id="cancelModalConfirm"
            className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Yes, Cancel It
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function CancelBookingPage() {
  // Step 1 state
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  // Step 2 state
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [lookupEmail, setLookupEmail] = useState("");

  // Step 3 state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ── Step 1: Lookup by email ──────────────────────────────────
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) { setEmailError("Email is required"); return; }
    if (!validateEmail(emailInput.trim())) { setEmailError("Please enter a valid email address"); return; }
    setEmailError("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://final-project-em3w.onrender.com/api";
    try {
      const { data } = await axios.get(
        `${apiUrl}/bookings/by-email?email=${encodeURIComponent(emailInput.trim())}`
      );
      setBookings(data.data ?? []);
      setLookupEmail(emailInput.trim());
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to fetch bookings. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  // ── Step 3: Confirm cancel ───────────────────────────────────
  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setCancelLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://final-project-em3w.onrender.com/api";
    try {
      await axios.patch(`${apiUrl}/bookings/cancel`, {
        bookingId: selectedBooking.id,
        email: lookupEmail,
      });
      toast.success("Booking cancelled successfully.");
      setBookings((prev) => prev?.filter((b) => b.id !== selectedBooking.id) ?? []);
      setSelectedBooking(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to cancel booking. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      {/* Page */}
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Hero strip */}
        <div className="bg-gradient-to-r from-red-600 to-rose-500 py-14 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-red-200 text-xs font-semibold uppercase tracking-widest block mb-2">
              Manage Booking
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
              Cancel a Booking
            </h1>
            <p className="text-red-100 text-sm max-w-md mx-auto">
              Enter the email you used when booking to look up and cancel your reservation.
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* ── Step 1: Email Lookup ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)] shadow-sm p-8 mb-8"
          >
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">
              Find Your Booking
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Enter the email address associated with your booking.
            </p>
            <form onSubmit={handleLookup} noValidate className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div
                  className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border transition-colors ${
                    emailError ? "border-red-400" : "border-[var(--border)] focus-within:border-sky-500"
                  }`}
                >
                  <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <input
                    id="cancelLookupEmail"
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-xs mt-1.5">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={lookupLoading}
                id="lookupBookingBtn"
                className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-xl transition-all whitespace-nowrap"
              >
                {lookupLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {lookupLoading ? "Searching..." : "Find Bookings"}
              </button>
            </form>
          </motion.div>

          {/* ── Step 2: Booking List ──────────────────────────── */}
          <AnimatePresence mode="wait">
            {bookings !== null && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Section header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    Active Bookings for{" "}
                    <span className="text-sky-500">{lookupEmail}</span>
                  </h2>
                  <button
                    onClick={() => { setBookings(null); setEmailInput(""); setLookupEmail(""); }}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-sky-500 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Search again
                  </button>
                </div>

                {bookings.length === 0 ? (
                  /* Empty state */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border)]"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-1">
                      No active bookings found
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto">
                      There are no active bookings for{" "}
                      <strong>{lookupEmail}</strong>. All may already be cancelled.
                    </p>
                    <Link
                      href="/accommodation"
                      className="inline-flex items-center gap-2 mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
                    >
                      Browse Accommodation
                    </Link>
                  </motion.div>
                ) : (
                  /* Booking cards */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <AnimatePresence>
                      {bookings.map((b) => (
                        <BookingCard
                          key={b.id}
                          booking={b}
                          onCancel={setSelectedBooking}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-4"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-semibold mb-1">Cancellation Policy</p>
              <ul className="space-y-0.5 text-amber-700 dark:text-amber-400">
                <li>• Free cancellation before 48 hours of check-in</li>
                <li>• 50% charge for cancellations within 48 hours</li>
                <li>• No refund for no-shows</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Step 3: Confirm Modal ─────────────────────────────── */}
      <AnimatePresence>
        {selectedBooking && (
          <ConfirmModal
            booking={selectedBooking}
            onConfirm={handleConfirmCancel}
            onClose={() => !cancelLoading && setSelectedBooking(null)}
            loading={cancelLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
