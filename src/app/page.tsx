"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Star, ArrowRight, Heart,
  Mountain, Zap, Tent, Waves, TreePine, Camera, Users,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { destinations, featuredAccommodations, testimonials } from "@/lib/data";

// ─── Hero Slides ──────────────────────────────────────────────
const heroSlides = [
  {
    image: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353785/dest_Indrahar_Pass_tficnj.jpg",
    badge: "✦ Discover the Himalayas",
    title: ["Where Mountains", "Speak to Your Soul"],
    subtitle: "Experience the untouched beauty, ancient wisdom, and thrilling adventures of Himachal Pradesh",
    cta: { primary: { href: "/destinations", label: "Explore Destinations" }, secondary: { href: "/gallery", label: "View Gallery" } },
  },
  {
    image: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353785/dest_Indrahar_Pass_tficnj.jpg",
    badge: "✦ Little Lhasa",
    title: ["Tibetan Serenity", "in the Himalayas"],
    subtitle: "Monasteries, chai shops, and the Dalai Lama's home — Dharamshala awaits your soul",
    cta: { primary: { href: "/destinations?district=Kangra", label: "Explore Kangra" }, secondary: { href: "/accommodation", label: "Book Stay" } },
  },
  {
    image: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353785/dest_Indrahar_Pass_tficnj.jpg",
    badge: "✦ Crystal Lakes",
    title: ["Chandratal —", "Moon Lake at 4300m"],
    subtitle: "Crescent-shaped Ramsar wetland surrounded by barren Himalayan peaks. Pure, surreal magic.",
    cta: { primary: { href: "/destinations?district=Lahaul+%26+Spiti", label: "Explore Spiti" }, secondary: { href: "/how-to-reach", label: "Plan Journey" } },
  },
];

const stats = [
  { value: 180, suffix: "+", label: "Destinations", icon: MapPin },
  { value: 240, suffix: "+", label: "Hotels & Resorts", icon: Mountain },
  { value: 2, suffix: "M+", label: "Annual Visitors", icon: Users },
  { value: 45, suffix: "+", label: "Adventure Sports", icon: Zap },
];

const experiences = [
  { icon: Mountain, label: "Trekking", count: "100+ Trails", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: Waves, label: "River Rafting", count: "Grade I–IV", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: Zap, label: "Paragliding", count: "Bir Billing", color: "from-purple-500 to-violet-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { icon: Camera, label: "Photography", count: "Scenic Spots", color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { icon: Tent, label: "Camping", count: "Stargazing", color: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  { icon: TreePine, label: "Wildlife", count: "UNESCO Parks", color: "from-lime-600 to-green-500", bg: "bg-lime-50 dark:bg-lime-900/20" },
];

const highlights = [
  { icon: "🏔️", title: "6,000m+ Peaks", desc: "India's highest accessible mountain passes" },
  { icon: "🌸", title: "UNESCO Heritage", desc: "Great Himalayan NP — rare flora & fauna" },
  { icon: "🍎", title: "Apple Orchards", desc: "Fragrant apple & cherry orchards in season" },
  { icon: "🎭", title: "Vibrant Festivals", desc: "Kullu Dussehra, Losar, Minjar Fair" },
  { icon: "🌊", title: "Sacred Rivers", desc: "Beas, Ravi, Sutlej — origins of Indian rivers" },
  { icon: "🛤️", title: "Scenic Roads", desc: "Manali–Leh — world's most dramatic drives" },
];


// Counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

function StatItem({ stat }: { stat: typeof stats[0] }) {
  const { count, ref } = useCounter(stat.value);
  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        <stat.icon className="w-5 h-5 text-sky-400" />
      </div>
      <div className="text-4xl font-bold font-display text-black dark:text-white">
        {count}<span className="text-sky-400">{stat.suffix}</span>
      </div>
      <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
    </div>
  );
}

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [testiIdx, setTestiIdx] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[heroIdx];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCat) params.set("cat", searchCat);
    window.location.href = `/destinations?${params.toString()}`;
  };

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const testiCards = 3;
  const maxIdx = Math.ceil(testimonials.length / testiCards) - 1;

  return (
    <div className="overflow-x-hidden">
      {/* ──────────────── HERO ─────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden" id="hero">
        {/* Background Images with parallax */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{ y: heroY }}
          >
            <Image
              src={slide.image}
              alt={slide.title.join(" ")}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="hero-overlay absolute inset-0 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <span className="inline-block px-5 py-2 rounded-full glass-dark text-sky-300 text-sm font-medium mb-6">
                {slide.badge}
              </span>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6">
                {slide.title[0]}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">
                  {slide.title[1]}
                </span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={slide.cta.primary.href} className="btn-primary text-base px-8 py-4">
                  {slide.cta.primary.label}
                </Link>
                <Link
                  href={slide.cta.secondary.href}
                  className="glass-dark text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {slide.cta.secondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`transition-all duration-300 rounded-full ${i === heroIdx ? "w-8 h-2 bg-sky-400" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev/Next */}
          <button
            onClick={() => setHeroIdx((i) => (i - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setHeroIdx((i) => (i + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Smart Search Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-0">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="glass rounded-t-3xl p-4 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="flex-1 flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-5 py-3.5 shadow-sm">
                  <Search className="w-5 h-5 text-sky-500 flex-shrink-0" />
                  <input
                    type="text"
                    id="heroSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search Shimla, Manali, Spiti, Kasol..."
                    className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-gray-400 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <select
                    id="searchCategory"
                    value={searchCat}
                    onChange={(e) => setSearchCat(e.target.value)}
                    className="flex-1 md:flex-none bg-white dark:bg-gray-800 text-[var(--text-primary)] text-sm px-4 py-3.5 rounded-2xl shadow-sm border-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  >
                    <option value="">All Categories</option>
                    <option value="hill-station">Hill Station</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="lake">Lakes</option>
                    <option value="trek">Trekking</option>
                    <option value="pilgrimage">Pilgrimage</option>
                    <option value="offbeat">Off-Beat</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    id="searchBtn"
                    className="btn-primary px-8 py-3.5 whitespace-nowrap"
                  >
                    Explore
                  </button>
                </div>
              </div>
              {/* Quick filters */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {["⛰️ Mountains", "🏖️ Lakes", "🛕 Temples", "🏕️ Camping", "🪂 Paragliding", "🥾 Trekking"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      const cat = f.includes("Mountain") ? "hill-station" : f.includes("Lake") ? "lake" : f.includes("Temple") ? "pilgrimage" : f.includes("Camp") ? "offbeat" : f.includes("Paraglid") ? "adventure" : "trek";
                      window.location.href = `/destinations?cat=${cat}`;
                    }}
                    className="flex-shrink-0 text-xs bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-all"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────── STATS ──────────────────────────────── */}
      <section className="bg//\\-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s) => (
              <StatItem key={s.label} stat={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── FEATURED DESTINATIONS ──────────────── */}
      <section className="py-24 bg-[var(--bg-primary)]" id="featured-destinations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="section-subtitle block mb-3">Must Visit</span>
            <h2 className="section-title mb-4">Top Destinations</h2>
            <p className="section-desc max-w-2xl mx-auto">
              The crown jewels of Himachal Pradesh — breathtaking, memorable, unforgettable
            </p>
          </motion.div>

          {/* Grid: Left large card + 2x2 right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
            {/* Large featured card — Shimla */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 relative group rounded-3xl overflow-hidden h-[480px] card-hover cursor-pointer"
            >
              <div className="absolute inset-0 img-zoom">
                <Image
                  src="https://res.cloudinary.com/dtypvw22g/image/upload/v1777353726/dest_shimla_ridge_w3wbpl.jpg"
                  alt="Shimla"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={() => toggleFavorite("shimla-ridge")}
                className="absolute top-4 right-4 w-9 h-9 glass-dark rounded-full flex items-center justify-center z-10"
              >
                <Heart className={`w-4 h-4 ${favorites.includes("shimla-ridge") ? "fill-rose-500 text-rose-500" : "text-white"}`} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <span className="tag-badge bg-sky-500/90 border-sky-400 text-sky-100 mb-3 inline-block">HILL STATION</span>
                <h3 className="font-display text-4xl font-bold text-white mb-2">Shimla</h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-md">
                  The Queen of Hills with colonial charm, cedar forests, and panoramic Himalayan views. 15+ iconic spots await.
                </p>
                <Link
                  href="/destinations?district=Shimla"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full hover:bg-sky-50 transition-colors"
                >
                  Explore →
                </Link>
              </div>
            </motion.div>

            {/* 2x2 right grid */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-5">
              {[
                { name: "Manali", district: "Kullu", tag: "ADVENTURE", img: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353584/dest_manali_xzqzhf.jpg", id: "manali-town" },
                { name: "Spiti Valley", district: "Lahaul & Spiti", tag: "OFF-BEAT", img: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353586/dest_spiti_ct9vdi.jpg", id: "spiti-kaza" },
                { name: "Lahaul", district: "Lahaul & Spiti", tag: "BACKPACKING", img: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353592/dest_lahual_ix9rza.jpg", id: "spiti-chandratal" },
                { name: "Kinnaur", district: "Kinnaur", tag: "CULTURAL", img: "https://res.cloudinary.com/dtypvw22g/image/upload/v1777353595/dest_kinnaur1_vbloat.jpg", id: "kinnaur-kalpa" },
              ].map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden h-[225px] card-hover cursor-pointer"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={dest.img}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="25vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <button
                    onClick={() => toggleFavorite(dest.id)}
                    className="absolute top-3 right-3 w-7 h-7 glass-dark rounded-full flex items-center justify-center z-10"
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(dest.id) ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <span className="text-xs bg-sky-500/90 text-white px-2 py-0.5 rounded-full font-semibold">{dest.tag}</span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">{dest.name}</h3>
                    <Link
                      href={`/destinations?district=${dest.district}`}
                      className="text-sky-300 text-xs font-medium flex items-center gap-1 mt-1 hover:text-white transition-colors"
                    >
                      Explore <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/destinations" id="viewAllDestinations" className="btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────── FEATURED ACCOMMODATION ─────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50" id="featured-accommodation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-subtitle block mb-3">Where to Stay</span>
            <h2 className="section-title mb-4">Featured Accommodations</h2>
            <p className="section-desc max-w-2xl mx-auto">
              From luxury mountain resorts to cozy Spiti homestays — we have got the perfect stay for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {featuredAccommodations.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover border border-[var(--border)]"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="20vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs bg-sky-500 text-white px-2.5 py-1 rounded-full font-semibold">
                      {hotel.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm line-clamp-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <MapPin className="w-3 h-3 text-sky-500" />
                    <span className="text-xs text-[var(--text-secondary)]">{hotel.district}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < Math.round(hotel.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">{hotel.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">from</span>
                      <p className="font-bold text-sky-600 dark:text-sky-400 text-sm">₹{hotel.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span></p>
                    </div>
                    <Link
                      href="/accommodation"
                      className="text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white px-3 py-1.5 rounded-full font-medium transition-all"
                    >
                      Book →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/accommodation" className="btn-secondary">
              View All Accommodation
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────── EXPERIENCES ────────────────────────── */}
      <section className="py-24 bg-[var(--bg-primary)]" id="experiences">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-subtitle block mb-3">Adventures Await</span>
            <h2 className="section-title mb-4">Experiences & Activities</h2>
            <p className="section-desc max-w-2xl mx-auto">
              From snow-clad summits to serene monastery trails — your Himalayan adventure begins here
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`${exp.bg} rounded-2xl p-5 text-center group hover:scale-105 transition-all duration-300 cursor-pointer border border-transparent hover:border-sky-200 dark:hover:border-sky-800`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <exp.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] text-sm">{exp.label}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{exp.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── HIGHLIGHTS ─────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "url(https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80) center/cover fixed" }}
        id="highlights"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/90 to-indigo-900/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sky-300 font-semibold text-sm uppercase tracking-widest block mb-3">
              Why Himachal Pradesh
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Travel Highlights
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-dark rounded-2xl p-6 flex items-start gap-5 hover:bg-white/15 transition-all group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{h.icon}</span>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">{h.title}</h4>
                  <p className="text-sky-200 text-sm leading-relaxed">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ──────────────── TESTIMONIALS ───────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-subtitle block mb-3">Visitor Stories</span>
            <h2 className="section-title mb-4">What Travelers Say</h2>
            <p className="section-desc max-w-2xl mx-auto">
              Real experiences from real adventurers who fell in love with Himachal Pradesh
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                key={testiIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {testimonials.slice(testiIdx * testiCards, testiIdx * testiCards + testiCards).map((t) => (
                  <div
                    key={t.id}
                    className="bg-[var(--bg-secondary)] rounded-2xl p-7 shadow-sm border border-[var(--border)] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-4xl text-sky-300 font-serif leading-none mb-4">❝</div>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5 line-clamp-4 italic">
                      {t.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)] text-sm">{t.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{t.location}</p>
                        </div>
                      </div>
                      <div className="star-rating text-sm">{"★".repeat(t.rating)}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setTestiIdx((i) => Math.max(0, i - 1))}
                disabled={testiIdx === 0}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-sky-500 hover:text-sky-500 disabled:opacity-30 transition-all"
                id="prevTestimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestiIdx(i)}
                    className={`rounded-full transition-all ${i === testiIdx ? "w-6 h-2 bg-sky-500" : "w-2 h-2 bg-gray-300 dark:bg-gray-600"}`}
                    aria-label={`Testimonial page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestiIdx((i) => Math.min(maxIdx, i + 1))}
                disabled={testiIdx === maxIdx}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-sky-500 hover:text-sky-500 disabled:opacity-30 transition-all"
                id="nextTestimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}



