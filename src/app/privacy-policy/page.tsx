import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for Himachal Explorer. Learn how we collect, use, and protect your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as your name, email address, phone number, and travel preferences when you make a booking, fill out a contact form, or subscribe to our newsletter. We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to: process and manage your bookings; send booking confirmations and updates; respond to your inquiries and support requests; send promotional communications (with your consent); improve our website and services; prevent fraudulent activity; and comply with legal obligations.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with accommodation partners to fulfil your booking, service providers who assist in operating our website, and when required by law or to protect our legal rights.`,
  },
  {
    title: "4. Cookies",
    content: `We use cookies and similar tracking technologies to improve your experience on our site, remember your preferences (such as dark mode), and analyse site traffic. You can control cookie settings through your browser. Disabling cookies may affect some functionality.`,
  },
  {
    title: "5. Data Security",
    content: `We implement appropriate technical and organisational measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Booking records are retained for up to 5 years. You may request deletion of your data by contacting us.`,
  },
  {
    title: "7. Your Rights",
    content: `Subject to applicable law, you may have the right to: access the personal information we hold about you; correct inaccurate data; request deletion of your data; object to processing; and data portability. To exercise these rights, contact us at nikhiloberoi828@gmail.com.`,
  },
  {
    title: "8. Third-Party Links",
    content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.`,
  },
  {
    title: "9. Children's Privacy",
    content: `Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at nikhiloberoi828@gmail.com or write to: Tourism Department, HP Secretariat, Shimla – 171 002, Himachal Pradesh.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 py-16 px-4 text-center">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-sky-300" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-sky-200 max-w-xl mx-auto text-sm">
          Last updated: May 2026 · Himachal Explorer is committed to protecting your privacy.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-8">
          <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-primary)]">Privacy Policy</span>
        </nav>

        <div className="prose prose-sky dark:prose-invert max-w-none space-y-8">
          <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-5 text-sm text-sky-800 dark:text-sky-300">
            <p>
              This Privacy Policy explains how <strong>Himachal Explorer</strong> ("we", "us", or "our")
              collects, uses, and safeguards your information when you use our website and services.
              By using our site, you agree to the terms described here.
            </p>
          </div>

          {sections.map((s) => (
            <div key={s.title} className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)]">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] mb-3">
                {s.title}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
