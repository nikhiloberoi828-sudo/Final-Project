"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Home,
  Leaf,
  Map,
  MapPin,
  Palette,
  TreePine,
  Users,
} from "lucide-react";

const campaignDestinations = [
  {
    name: "Chitkul",
    district: "Kinnaur",
    desc: "The last inhabited village on the Indo-Tibet border, wrapped in apple orchards and glacier views.",
    img: "https://images.unsplash.com/photo-1593608347479-da41e6ae3fb6?w=600&q=80",
  },
  {
    name: "Langza Village",
    district: "Lahaul & Spiti",
    desc: "A fossil-rich village at 4400m with a giant Buddha statue looking over the Spiti Valley.",
    img: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&q=80",
  },
  {
    name: "Janjheli Valley",
    district: "Mandi",
    desc: "An untouched green valley surrounded by thick deodar forests and serene meadows.",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    name: "Bara Banghal",
    district: "Kangra",
    desc: "A remote Gaddi pastoral village accessible only on foot, full of raw Himalayan life.",
    img: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=80",
  },
  {
    name: "Tirthan Valley",
    district: "Kullu",
    desc: "A pristine valley bordering Great Himalayan National Park, perfect for forest walks and quiet stays.",
    img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80",
  },
  {
    name: "Narkanda",
    district: "Shimla",
    desc: "A snow-dusted apple town with skiing slopes, Hatu Temple, and wide sunset views.",
    img: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=600&q=80",
  },
  {
    name: "Pangi Valley",
    district: "Chamba",
    desc: "One of India's most remote valleys, rich with tribal culture and dramatic river landscapes.",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  },
  {
    name: "Barot Valley",
    district: "Mandi",
    desc: "A hidden gem along the Uhl River with trout fishing, dense forests, and very few crowds.",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  },
  {
    name: "Karsog Valley",
    district: "Mandi",
    desc: "Terraced fields, ancient temples, and quiet forests that feel far away from typical tourist routes.",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
  },
  {
    name: "Churdhar Peak",
    district: "Sirmaur",
    desc: "The highest peak in Sirmaur, offering a demanding trek and sweeping Himalayan views.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  },
  {
    name: "Rewalsar Lake",
    district: "Mandi",
    desc: "A sacred lake shared by Hindu, Sikh, and Buddhist traditions in one peaceful setting.",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
  },
  {
    name: "Andretta Village",
    district: "Kangra",
    desc: "An artists' village known for pottery, theatre, and the creative spirit of the Palampur hills.",
    img: "https://images.unsplash.com/photo-1561059488-916d69792237?w=600&q=80",
  },
];

const initiatives = [
  {
    icon: Leaf,
    title: "Eco Tourism",
    desc: "Promoting low-impact travel that protects fragile ecosystems from Spiti's cold desert to Kangra's tea country.",
    color: "from-sky-500 to-blue-600",
    badge: "Sustainable",
  },
  {
    icon: Home,
    title: "Village Homestays",
    desc: "Connecting travelers with local families so tourism income reaches remote communities directly.",
    color: "from-emerald-500 to-teal-600",
    badge: "Community-led",
  },
  {
    icon: Map,
    title: "Offbeat Routes",
    desc: "Opening lesser-known trails, valleys, and villages to spread tourism beyond the usual hotspots.",
    color: "from-indigo-500 to-sky-600",
    badge: "Beyond the usual",
  },
  {
    icon: Palette,
    title: "Cultural Preservation",
    desc: "Supporting local artisans, folk traditions, and temple festivals so heritage stays visible and valued.",
    color: "from-amber-500 to-orange-500",
    badge: "Living heritage",
  },
];

const milestones = [
  {
    icon: MapPin,
    target: 30,
    suffix: "+",
    label: "New Destinations Added",
    desc: "Places that are now easier for travelers to discover responsibly.",
  },
  {
    icon: Home,
    target: 100,
    suffix: "+",
    label: "Villages Promoted",
    desc: "Rural communities now included in the tourism story.",
  },
  {
    icon: Users,
    target: 5000,
    suffix: "+",
    label: "Travelers Engaged",
    desc: "Visitors choosing more mindful and balanced itineraries.",
  },
  {
    icon: TreePine,
    target: 50,
    suffix: "+",
    label: "Eco Initiatives",
    desc: "Programs supporting cleaner, lower-impact tourism growth.",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function NaiRaaheinPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      <section className="relative h-[82vh] min-h-[640px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Nai Raahein Nai Manzilein"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-overlay absolute inset-0 z-10" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/70 via-slate-900/50 to-sky-950/50" />

        <div className="relative z-20 h-full flex items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <span className="inline-block px-5 py-2 rounded-full glass-dark text-sky-300 text-sm font-medium mb-6">
              Government Initiative for Responsible Tourism
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
              Nai Raahein
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300">
                Nai Manzilein
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover quieter corners of Himachal Pradesh, support local communities, and travel in a way that feels more meaningful and more sustainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations" className="btn-primary text-base px-8 py-4">
                Explore Destinations
              </Link>
              <a
                href="#initiatives"
                className="glass-dark text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                See Initiatives
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass rounded-t-3xl p-4 md:p-5 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-white/30 dark:border-slate-800/70 text-left">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                    <Map className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Lesser-known routes</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Move beyond the usual circuit and discover quieter districts.</p>
                </div>
                <div className="bg-white/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-white/30 dark:border-slate-800/70 text-left">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3 shadow-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Community stays</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Help tourism benefits reach village households and local hosts.</p>
                </div>
                <div className="bg-white/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-white/30 dark:border-slate-800/70 text-left">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center mb-3 shadow-lg">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Low-impact travel</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Protect fragile landscapes while keeping journeys rich and authentic.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle block mb-3">Campaign Vision</span>
              <h2 className="section-title mb-6">A wider, more balanced way to experience Himachal</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Himachal Pradesh is much more than its most famous postcard towns. Across every district, there are quieter valleys, village traditions, and landscapes that deserve thoughtful attention.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Nai Raahein Nai Manzilein brings those places forward while encouraging travel that respects the environment, supports local livelihoods, and distributes tourism more evenly.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                The goal is simple: help travelers see a deeper side of Himachal while making tourism healthier for the places and people who live there.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border)] shadow-sm">
                  <p className="text-2xl font-display font-bold text-[var(--text-primary)]">30+</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Emerging destinations highlighted</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border)] shadow-sm">
                  <p className="text-2xl font-display font-bold text-[var(--text-primary)]">100+</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Village experiences brought into focus</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border)] shadow-sm">
                  <p className="text-2xl font-display font-bold text-[var(--text-primary)]">12</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Districts included in the campaign story</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[440px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=900&q=80"
                alt="Responsible travel in Himachal Pradesh"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark rounded-2xl p-5 border border-white/10">
                  <p className="text-sm font-semibold text-white">Travel that leaves a better footprint</p>
                  <p className="text-xs text-slate-200 mt-1">
                    Better route distribution, stronger local participation, and more care for sensitive landscapes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="initiatives" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-subtitle block mb-3">What The Campaign Focuses On</span>
            <h2 className="section-title mb-4">Core initiatives</h2>
            <p className="section-desc max-w-2xl mx-auto">
              These are the same kinds of experiences the rest of the platform promotes, now shaped specifically around responsible tourism.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)] shadow-sm hover:shadow-xl card-hover"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${initiative.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <initiative.icon className="w-7 h-7 text-white" />
                </div>
                <span className="tag-badge mb-3">{initiative.badge}</span>
                <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-2">{initiative.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{initiative.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-subtitle block mb-3">Explore Offbeat</span>
            <h2 className="section-title mb-4">Featured campaign destinations</h2>
            <p className="section-desc max-w-2xl mx-auto">
              A curated set of quieter places that fit naturally with the rest of the site&apos;s discovery experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {campaignDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.08 }}
                className="group bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)] card-hover"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={destination.img}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="tag-badge bg-white/90 text-sky-700 border-white/80 dark:bg-slate-900/80 dark:text-sky-300 dark:border-slate-800/80">
                      {destination.district}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-2">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-sky-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{destination.district}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3">{destination.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sky-300 font-semibold text-sm uppercase tracking-widest block mb-3">Campaign Progress</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Milestones so far</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Presented in the same stat-driven visual style as the rest of the platform, with the campaign&apos;s impact at the center.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-dark rounded-2xl p-6 text-center border border-white/10"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <milestone.icon className="w-6 h-6 text-sky-300" />
                </div>
                <div className="font-display text-4xl font-bold text-white mb-2">
                  <AnimatedCounter target={milestone.target} suffix={milestone.suffix} />
                </div>
                <h3 className="text-sky-200 font-semibold text-sm mb-2">{milestone.label}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-primary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-2xl text-center"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <span className="inline-block text-sky-200 font-semibold text-sm uppercase tracking-widest mb-4">
                Start Your Journey
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
                Ready to explore beyond the usual route?
              </h2>
              <p className="text-sky-100 max-w-2xl mx-auto leading-relaxed mb-8">
                Use the same discovery tools across the site to plan a trip that feels more local, more intentional, and more connected to Himachal&apos;s quieter destinations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/destinations"
                  className="inline-flex items-center justify-center gap-2 bg-white text-sky-600 font-bold px-8 py-4 rounded-full hover:bg-sky-50 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Explore All Destinations
                </Link>
                <Link
                  href="/accommodation"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Find Accommodation
                </Link>
                <Link
                  href="/how-to-reach"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  Plan the Route
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
