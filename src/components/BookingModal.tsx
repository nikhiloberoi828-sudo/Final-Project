"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, MapPin, Calendar, Bed, DollarSign, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  hotelPrice: number;
  district: string;
}

const roomTypes = [
  { value: "Standard Room", label: "Standard Room", multiplier: 1 },
  { value: "Deluxe Room", label: "Deluxe Room", multiplier: 1.4 },
  { value: "Super Deluxe", label: "Super Deluxe", multiplier: 1.7 },
  { value: "Suite", label: "Suite", multiplier: 2.2 },
  { value: "Executive Suite", label: "Executive Suite", multiplier: 3.0 },
];

export default function BookingModal({ isOpen, onClose, hotelName, hotelPrice, district }: BookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: district || "",
    check_in: "",
    check_out: "",
    room_type: "Standard Room",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedRoom = roomTypes.find((r) => r.value === form.room_type)!;

  const nights = (() => {
    if (!form.check_in || !form.check_out) return 0;
    const diff = new Date(form.check_out).getTime() - new Date(form.check_in).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const totalPrice = Math.round(hotelPrice * selectedRoom.multiplier * Math.max(nights, 1));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.check_in) errs.check_in = "Check-in date required";
    if (!form.check_out) errs.check_out = "Check-out date required";
    if (form.check_in && form.check_out && form.check_out <= form.check_in)
      errs.check_out = "Check-out must be after check-in";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      await axios.post("http://localhost:7500/api/bookings", {
        ...form,
        hotel_name: hotelName,
        total_price: totalPrice,
      });
      toast.success(`🎉 Booking confirmed at ${hotelName}! Check your email for details.`);
      onClose();
      setForm({ name: "", email: "", location: district, check_in: "", check_out: "", room_type: "Standard Room" });
    } catch (error: any) {
      console.error(error);
      toast.error(`❌ Booking failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-3xl shadow-2xl overflow-hidden"
            id="bookingModal"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 pb-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sky-200 text-sm font-medium">Complete Your Booking</p>
                  <h2 className="text-white font-display font-bold text-xl mt-1">{hotelName}</h2>
                  <p className="text-sky-200 text-sm mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {district}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  id="closeBookingModal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price Summary Strip */}
            <div className="mx-6 -mt-4 bg-[var(--bg-secondary)] rounded-2xl shadow-lg border border-[var(--border)] p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Base price / night</p>
                <p className="font-bold text-[var(--text-primary)]">
                  ₹{hotelPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)]">Nights</p>
                <p className="font-bold text-[var(--text-primary)]">{nights || "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--text-secondary)]">Total estimate</p>
                <p className="font-bold text-sky-500 text-lg">
                  ₹{nights > 0 ? totalPrice.toLocaleString() : "—"}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-sky-500" /> Full Name
                </label>
                <input
                  id="bookingName"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                    errors.name ? "border-red-400" : "border-[var(--border)]"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-500" /> Email Address
                </label>
                <input
                  id="bookingEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                    errors.email ? "border-red-400" : "border-[var(--border)]"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" /> Your Location / City
                </label>
                <input
                  id="bookingLocation"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Delhi, Mumbai..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                    errors.location ? "border-red-400" : "border-[var(--border)]"
                  }`}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" /> Check-In
                  </label>
                  <input
                    id="bookingCheckIn"
                    type="date"
                    min={today}
                    value={form.check_in}
                    onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                    className={`w-full px-3 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                      errors.check_in ? "border-red-400" : "border-[var(--border)]"
                    }`}
                  />
                  {errors.check_in && <p className="text-red-500 text-xs mt-1">{errors.check_in}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" /> Check-Out
                  </label>
                  <input
                    id="bookingCheckOut"
                    type="date"
                    min={form.check_in || today}
                    value={form.check_out}
                    onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                    className={`w-full px-3 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                      errors.check_out ? "border-red-400" : "border-[var(--border)]"
                    }`}
                  />
                  {errors.check_out && <p className="text-red-500 text-xs mt-1">{errors.check_out}</p>}
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                  <Bed className="w-3.5 h-3.5 text-sky-500" /> Room Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roomTypes.map((room) => (
                    <button
                      key={room.value}
                      type="button"
                      onClick={() => setForm({ ...form, room_type: room.value })}
                      className={`px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                        form.room_type === room.value
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400"
                          : "border-[var(--border)] text-[var(--text-secondary)] hover:border-sky-200"
                      }`}
                    >
                      <div className="font-medium">{room.label}</div>
                      <div className="text-xs opacity-70">₹{Math.round(hotelPrice * room.multiplier).toLocaleString()}/night</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                id="submitBooking"
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Confirm Booking {nights > 0 ? `• ₹${totalPrice.toLocaleString()}` : ""}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[var(--text-secondary)]">
                🔒 Secure booking • No payment required now • Free cancellation within 24h
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
