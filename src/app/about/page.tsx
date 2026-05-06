"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Globe, Award, Users, Mountain, TreePine, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
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
    let s = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);
  return (
    <div ref={ref} className="text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)]">
      {count}<span className="text-sky-500">{suffix}</span>
    </div>
  );
}

const team = [
  { name: "Nikhil Kumar", role: "Founder & CEO", initials: "NK", color: "from-sky-500 to-blue-600", bio: "15+ years in Himalayan tourism. Passionate mountaineer and travel writer." },
  { name: "Deepika Sharma", role: "Head of Experiences", initials: "DS", color: "from-emerald-500 to-teal-600", bio: "Cultural tourism expert and former Himachal Tourism officer." },
  { name: "Sujal Vardhan", role: "Technology Lead", initials: "SV", color: "from-purple-500 to-violet-600", bio: "Building AI-powered travel systems for the modern explorer." },
  { name: "Anurag Verma", role: "Community Manager", initials: "AV", color: "from-rose-500 to-pink-600", bio: "Ensuring responsible and sustainable tourism in every district." },
];

const values = [
  { icon: Heart, title: "Sustainable Travel", desc: "We promote eco-friendly tourism that protects Himachal's fragile environment and local communities." },
  { icon: Globe, title: "Authentic Experiences", desc: "Connect with real Himachali culture — from Spiti monasteries to Kinnaur apple orchards." },
  { icon: Award, title: "Quality Assured", desc: "Every destination and accommodation is verified, reviewed, and quality-checked by our team." },
  { icon: Users, title: "Community First", desc: "We ensure tourism benefits local guides, homestay owners, and artisans — not just big corporations." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&q=80"
          alt="About Himachal Explorer"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-300 text-sm font-semibold uppercase tracking-widest block mb-2">Our Story</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">About Us</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Born in the mountains. Built for the world. Connecting travelers to the soul of Himachal Pradesh.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="section-subtitle block mb-3">Our Mission</span>
            <h2 className="section-title mb-5">Discover the Soul of the Himalayas</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Himachal Explorer was born from a simple belief: that the mountains of Himachal Pradesh contain some of the world's most extraordinary experiences — and more people deserve to discover them.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              From the colonial charm of Shimla to the remote monasteries of Spiti, from the paragliding launches of Bir Billing to the sacred lake of Manimahesh — we curate every corner of this incredible state with love and expertise.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Our AI-powered platform doesn't just show you destinations — it helps you plan the perfect trip, find the right accommodation, and create memories that last a lifetime.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80"
              alt="Himachal Pradesh beauty"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </motion.div>
        </div>

        {/* Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-3xl p-12 mb-20 border border-sky-100 dark:border-sky-900/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { value: 180, suffix: "+", label: "Destinations", icon: Mountain },
              { value: 240, suffix: "+", label: "Hotels Listed", icon: Users },
              { value: 2, suffix: "M+", label: "Annual Visitors", icon: Globe },
              { value: 12, suffix: "", label: "Districts Covered", icon: TreePine },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <s.icon className="w-6 h-6 text-sky-500 mx-auto" />
                <Counter target={s.value} suffix={s.suffix} />
                <p className="text-[var(--text-secondary)] text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="section-subtitle block mb-3">What We Stand For</span>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
              >
                <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-sky-500" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{v.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-12">
            <span className="section-subtitle block mb-3">The People</span>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[var(--bg-secondary)] rounded-2xl p-6 text-center border border-[var(--border)] hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {member.initials}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">{member.name}</h3>
                <p className="text-sky-500 text-xs font-medium mb-2">{member.role}</p>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
