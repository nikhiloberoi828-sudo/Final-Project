import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the Terms of Use for Himachal Explorer. These terms govern your use of our travel website and booking services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Himachal Explorer website ("Site"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please discontinue use of our Site immediately.`,
  },
  {
    title: "2. Use of the Site",
    content: `You may use this Site for lawful purposes only. You agree not to: use the Site in any way that violates applicable local, national, or international law; transmit unsolicited communications; attempt to gain unauthorised access to any part of the Site or its systems; use automated tools to scrape or extract data without our prior written consent.`,
  },
  {
    title: "3. Booking Services",
    content: `Himachal Explorer acts as an information platform connecting travellers with accommodation providers. By making a booking through our Site, you enter into a direct contractual relationship with the accommodation provider. We facilitate the booking process but are not party to the accommodation contract.`,
  },
  {
    title: "4. Cancellation Policy",
    content: `Cancellations made more than 48 hours before check-in are eligible for a full refund. Cancellations within 48 hours of check-in will incur a 50% charge. No-shows will be charged in full. Refunds are processed within 5–10 business days depending on your payment method.`,
  },
  {
    title: "5. Accuracy of Information",
    content: `We strive to keep information accurate and up-to-date, but we make no warranties regarding the completeness, accuracy, or reliability of any information on the Site. Accommodation details, prices, and availability are subject to change and should be verified with the provider directly.`,
  },
  {
    title: "6. Intellectual Property",
    content: `All content on this Site — including text, images, logos, graphics, and code — is the property of Himachal Explorer or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "7. User-Generated Content",
    content: `If you submit reviews, photos, or other content, you grant us a non-exclusive, royalty-free, worldwide licence to use, modify, publish, and display that content in connection with our services. You represent that you own or have the necessary rights to submit such content.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the fullest extent permitted by law, Himachal Explorer shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or services. Our total liability for any claim shall not exceed the amount paid by you for the relevant booking.`,
  },
  {
    title: "9. Indemnification",
    content: `You agree to indemnify and hold harmless Himachal Explorer, its directors, employees, and partners from any claims, damages, or expenses arising from your use of the Site, your violation of these Terms, or your infringement of any third-party rights.`,
  },
  {
    title: "10. Privacy",
    content: `Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms are governed by the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Shimla, Himachal Pradesh.`,
  },
  {
    title: "12. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. Changes take effect immediately upon posting. Your continued use of the Site after changes are posted constitutes acceptance of the updated Terms.`,
  },
  {
    title: "13. Contact",
    content: `Questions regarding these Terms should be directed to: nikhiloberoi828@gmail.com or Tourism Department, HP Secretariat, Shimla – 171 002, Himachal Pradesh.`,
  },
];

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-16 px-4 text-center">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7 text-indigo-300" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
          Terms of Use
        </h1>
        <p className="text-indigo-200 max-w-xl mx-auto text-sm">
          Last updated: May 2026 · Please read these terms carefully before using our services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-8">
          <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-primary)]">Terms of Use</span>
        </nav>

        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 text-sm text-indigo-800 dark:text-indigo-300">
            <p>
              These Terms of Use govern your access to and use of the <strong>Himachal Explorer</strong> website
              and related services. By using our Site you accept these terms in full.
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
