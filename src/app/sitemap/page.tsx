import type { Metadata } from "next";
import Link from "next/link";
import { Map, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Navigate all pages of Himachal Explorer — destinations, accommodation, gallery, and more.",
};

const sitemapGroups = [
  {
    title: "Main Pages",
    color: "from-sky-500 to-blue-600",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/gallery", label: "Gallery" },
      { href: "/nai-raahein", label: "Nai Raahein" },
      { href: "/how-to-reach", label: "How to Reach" },
    ],
  },
  {
    title: "Destinations",
    color: "from-emerald-500 to-teal-600",
    links: [
      { href: "/destinations", label: "All Destinations" },
      { href: "/destinations?district=Shimla", label: "Shimla" },
      { href: "/destinations?district=Kullu", label: "Kullu / Manali" },
      { href: "/destinations?district=Kangra", label: "Kangra / Dharamshala" },
      { href: "/destinations?district=Chamba", label: "Chamba" },
      { href: "/destinations?district=Kinnaur", label: "Kinnaur" },
      { href: "/destinations?district=Lahaul+%26+Spiti", label: "Lahaul & Spiti" },
      { href: "/destinations?district=Mandi", label: "Mandi" },
      { href: "/destinations?district=Solan", label: "Solan" },
    ],
  },
  {
    title: "Accommodation",
    color: "from-amber-500 to-orange-600",
    links: [
      { href: "/accommodation", label: "All Properties" },
      { href: "/accommodation?district=Shimla", label: "Hotels in Shimla" },
      { href: "/accommodation?district=Kullu", label: "Hotels in Manali" },
      { href: "/accommodation?district=Kangra", label: "Hotels in Kangra" },
      { href: "/accommodation?district=Lahaul+%26+Spiti", label: "Hotels in Spiti" },
    ],
  },
  {
    title: "Experiences by Category",
    color: "from-purple-500 to-violet-600",
    links: [
      { href: "/destinations?cat=trek", label: "Trekking" },
      { href: "/destinations?cat=adventure", label: "Adventure Sports" },
      { href: "/destinations?cat=lake", label: "Lakes" },
      { href: "/destinations?cat=pilgrimage", label: "Pilgrimage" },
      { href: "/destinations?cat=offbeat", label: "Off-Beat Travel" },
      { href: "/destinations?cat=cultural", label: "Cultural Tourism" },
    ],
  },
  {
    title: "Bookings",
    color: "from-rose-500 to-pink-600",
    links: [
      { href: "/accommodation", label: "Book Accommodation" },
      { href: "/cancel-booking", label: "Cancel a Booking" },
    ],
  },
  {
    title: "Legal & Info",
    color: "from-gray-500 to-slate-600",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-use", label: "Terms of Use" },
      { href: "/sitemap", label: "Sitemap (this page)" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-900 py-16 px-4 text-center">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Map className="w-7 h-7 text-gray-300" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Sitemap</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          A complete overview of all pages and sections on Himachal Explorer.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-10">
          <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-primary)]">Sitemap</span>
        </nav>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapGroups.map((group) => (
            <div
              key={group.title}
              className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`bg-gradient-to-r ${group.color} px-5 py-3`}>
                <h2 className="font-semibold text-white text-sm">{group.title}</h2>
              </div>
              <ul className="p-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-sky-500 transition-colors group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sky-500" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
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
