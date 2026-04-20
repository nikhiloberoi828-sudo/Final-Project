"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mountain, Menu, X, Sun, Moon, Heart, ChevronDown,
  MapPin, Hotel, Navigation, Image, Info, Phone, Map
} from "lucide-react";

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/destinations",
    label: "Destinations",
    icon: MapPin,
    dropdown: [
      { href: "/destinations?cat=hill-station", label: "Hill Stations" },
      { href: "/destinations?cat=adventure", label: "Adventure Zones" },
      { href: "/destinations?cat=cultural", label: "Cultural Sites" },
      { href: "/destinations?cat=lake", label: "Lakes & Rivers" },
      { href: "/destinations?cat=trek", label: "Trekking Routes" },
      { href: "/destinations?cat=pilgrimage", label: "Pilgrimage Sites" },
    ],
  },
  { href: "/accommodation", label: "Accommodation", icon: Hotel },
  { href: "/how-to-reach", label: "How to Reach", icon: Navigation },
  { href: "/nai-raahein", label: "Nai Raahein", icon: Map },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Mountain className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white drop-shadow-lg block leading-tight">
                  Himachal
                </span>
                <span className="text-sky-300 text-xs font-semibold tracking-widest uppercase -mt-1 block">
                  Explorer
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-sky-500/20 text-sky-300"
                        : isScrolled
                        ? "text-gray-700 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.href ? "rotate-180" : ""}`} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 glass rounded-2xl p-2 shadow-xl border border-white/10"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Favorites */}
              <Link
                href="/destinations?view=favorites"
                className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isScrolled
                    ? "text-gray-600 dark:text-gray-300 hover:text-rose-500"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden md:inline">Saved</span>
              </Link>

              {/* Dark Mode */}
              <button
                onClick={toggleDark}
                id="themeToggle"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isScrolled
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-500"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                aria-label="Toggle dark mode"
              >
                <motion.div
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </button>

              {/* Book Now CTA */}
              <Link
                href="/accommodation"
                className="hidden sm:flex btn-primary text-sm !px-5 !py-2"
              >
                Book Now
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isScrolled
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    : "bg-white/10 text-white"
                }`}
                id="mobileMenuBtn"
                aria-label="Toggle mobile menu"
              >
                {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[var(--bg-secondary)] shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Mountain className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                      Himachal Explorer
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Links */}
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive(link.href)
                            ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400"
                            : "text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-sky-500"
                        }`}
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </Link>
                      {link.dropdown && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {link.dropdown.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="block px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-sky-500 transition-colors"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Bottom actions */}
                <div className="mt-8 space-y-3">
                  <Link
                    href="/accommodation"
                    onClick={() => setIsMobileOpen(false)}
                    className="btn-primary w-full text-center block"
                  >
                    Book Now
                  </Link>
                  <Link
                    href="/destinations?view=favorites"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text-primary)] hover:border-sky-500 hover:text-sky-500 transition-all"
                  >
                    <Heart className="w-4 h-4" /> Saved Trips
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
