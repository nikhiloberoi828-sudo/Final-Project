"use client";
import Link from "next/link";
import { Mountain, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const footerLinks = {
  explore: [
    { href: "/destinations", label: "Destinations" },
    { href: "/accommodation", label: "Accommodation" },
    { href: "/gallery", label: "Gallery" },
    { href: "/how-to-reach", label: "How to Reach" },
    { href: "/nai-raahein", label: "Nai Raahein" },
    { href: "/destinations?view=favorites", label: "Favorites" },
    { href: "/about", label: "About Us" },
  ],
  districts: [
    { href: "/destinations?district=Shimla", label: "Shimla" },
    { href: "/destinations?district=Kullu", label: "Kullu" },
    { href: "/destinations?district=Kangra", label: "Kangra" },
    { href: "/destinations?district=Chamba", label: "Chamba" },
    { href: "/destinations?district=Kinnaur", label: "Kinnaur" },
    { href: "/destinations?district=Lahaul+%26+Spiti", label: "Lahaul & Spiti" },
    { href: "/destinations?district=Mandi", label: "Mandi" },
    { href: "/destinations?district=Solan", label: "Solan" },
  ],
};

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-8">
      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-blue-900/70" />
          <div className="relative z-10 px-8 py-14 text-center">
            <p className="text-sky-300 text-sm font-semibold uppercase tracking-widest mb-3">
              Start Your Journey
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore Himachal Pradesh?
            </h2>
            <p className="text-sky-100 mb-8 max-w-xl mx-auto">
              Let our AI-powered planner create your perfect Himalayan itinerary — tailored to your budget, interests, and days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations" className="btn-primary">
                Explore Destinations
              </Link>
              <Link href="/accommodation" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-sky-900 transition-all duration-300">
                Book Accommodation
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-xl leading-tight">Himachal</div>
                <div className="text-sky-400 text-xs tracking-widest uppercase -mt-1">Explorer</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your premier guide to Himachal Pradesh tourism. Discover breathtaking landscapes, ancient temples, thrilling adventures, and authentic Himalayan culture.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-sky-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-5">Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-sky-400 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Districts */}
          <div>
            <h4 className="font-semibold text-white mb-5">Districts</h4>
            <ul className="space-y-2.5">
              {footerLinks.districts.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-sky-400 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Tourism Department, HP Secretariat, Shimla – 171 002</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href="tel:+911772658765" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
                  +91-177-265-8765
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href="mailto:tourism@himachalexplorer.in" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
                  tourism@himachalexplorer.in
                </a>
              </li>
            </ul>

            {/* Newsletter Mini */}
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm px-4 py-2 rounded-full focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button className="w-9 h-9 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Himachal Explorer. All Rights Reserved. Made with ❤️ for the Himalayas.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-sky-400 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
