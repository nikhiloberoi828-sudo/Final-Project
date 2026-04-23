"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "Tourism Dept, HP Secretariat, Shimla – 171 002", href: null },
  { icon: Phone, label: "Phone", value: "+91-177-265-8765", href: "tel:+911772658765" },
  { icon: Mail, label: "Email", value: "tourism@himachalexplorer.in", href: "mailto:tourism@himachalexplorer.in" },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat: 9:00 AM – 6:00 PM", href: null },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:6000/api/contact", {
        name: form.name,
        email: form.email,
        message: form.subject ? `[${form.subject}] ${form.message}` : form.message,
      });
      toast.success("✅ Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="relative h-60 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1600&q=80"
          alt="Contact Himachal Explorer"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-300 text-sm font-semibold uppercase tracking-widest block mb-2">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
                We're Here to Help
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Have a question about destinations, bookings, or travel planning? Our team of Himachal experts is ready to assist you.
              </p>
            </div>

            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start gap-4 bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border)] hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-0.5">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="text-[var(--text-primary)] font-medium text-sm hover:text-sky-500 transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-[var(--text-primary)] font-medium text-sm">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="map-container h-52">
              <iframe
                title="Himachal Tourism Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3415.6!2d77.159!3d31.104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3905a40b6993e1ab%3A0x6fffff68b742695b!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1711000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">Send a Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                      Full Name *
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                      Email *
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                    Subject
                  </label>
                  <input
                    id="contactSubject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-1.5 block">
                    Message *
                  </label>
                  <textarea
                    id="contactMessage"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your travel plans, questions, or feedback..."
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="sendMessage"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ chips */}
            <div className="mt-6">
              <p className="text-[var(--text-secondary)] text-sm mb-3">Common queries:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Best time to visit?",
                  "Inner Line Permit info",
                  "Spiti road conditions",
                  "Hotel partnerships",
                  "Tour packages",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setForm({ ...form, subject: q, message: `I have a query about: ${q}` })}
                    className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
