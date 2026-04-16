"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plane, Train, CarFront, MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const routes = [
  {
    mode: "By Air ✈️",
    icon: Plane,
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50 dark:bg-sky-900/10",
    airports: [
      { name: "Kullu-Manali Airport (Bhuntar)", desc: "Serves Kullu, Manali, Kasol", dist: "8 km from Kullu, 50 km from Manali" },
      { name: "Gaggal Airport (Kangra)", desc: "Serves Dharamshala, McLeod Ganj, Dalhousie", dist: "13 km from Dharamshala" },
      { name: "Shimla Airport (Jubbarhatti)", desc: "Connects to Delhi — seasonal", dist: "23 km from Shimla" },
      { name: "Chandigarh International Airport", desc: "Best hub for Shimla, Manali, Dharamshala", dist: "111 km from Shimla" },
    ],
    tips: [
      "Book flights to Chandigarh for best options and prices",
      "IndiGo and Air India operate on Bhuntar and Gaggal routes",
      "Mountain airports are weather-dependent — always have backup plans",
    ],
  },
  {
    mode: "By Train 🚆",
    icon: Train,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
    airports: [
      { name: "Kalka–Shimla Railway (UNESCO Heritage)", desc: "Toy Train — a World Heritage journey", dist: "96 km, ~5 hrs from Kalka" },
      { name: "Pathankot Railway Station", desc: "Gateway to Dalhousie, Chamba, Kangra", dist: "80 km from Dalhousie" },
      { name: "Chandigarh Railway Station", desc: "Best rail head for Shimla and Manali", dist: "111 km from Shimla" },
      { name: "Jogindernagar Narrow Gauge", desc: "Scenic narrow gauge to Mandi area", dist: "3 km from Jogindernagar" },
    ],
    tips: [
      "Kalka–Shimla Toy Train tickets available on IRCTC — book early!",
      "Chandigarh–Shimla: Shatabdi runs on some days (Book IRCTC)",
      "From Delhi, overnight trains to Kalka are convenient (Kalka Mail, Himalayan Queen)",
    ],
  },
  {
    mode: "By Road 🚗",
    icon: CarFront,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 dark:bg-amber-900/10",
    airports: [
      { name: "Delhi → Shimla", desc: "Via NH44 and NH5 (Chandigarh route)", dist: "340 km, ~7 hrs" },
      { name: "Delhi → Manali", desc: "Via NH44 → Chandigarh → Mandi → Manali", dist: "540 km, ~12 hrs (Volvo overnight)" },
      { name: "Chandigarh → Dharamshala", desc: "Via NH503 through Kiratpur", dist: "230 km, ~5 hrs" },
      { name: "Shimla → Spiti (Kaza)", desc: "Via NH5 → Kinnaur → Kaza", dist: "460 km, ~14 hrs, summer only" },
    ],
    tips: [
      "HRTC Volvo/Semi-Deluxe buses run Delhi→Manali/Shimla/Dharamshala overnight",
      "Spiti via Manali (Rohtang) is open Jun–Oct; via Shimla (Kinnaur) Jun–Nov",
      "Inner Line Permit required for Kinnaur and Spiti for Indian & foreign nationals",
      "Download offline maps (Maps.me or OsmAnd) for remote areas with no network",
    ],
  },
];

const distances = [
  { from: "Delhi", to: "Shimla", km: 340, hrs: "7–8" },
  { from: "Delhi", to: "Manali", km: 540, hrs: "12–14" },
  { from: "Delhi", to: "Dharamshala", km: 480, hrs: "10–12" },
  { from: "Delhi", to: "Dalhousie", km: 560, hrs: "12–13" },
  { from: "Chandigarh", to: "Shimla", km: 111, hrs: "2.5–3" },
  { from: "Chandigarh", to: "Manali", km: 310, hrs: "7–8" },
  { from: "Shimla", to: "Kaza (Spiti)", km: 460, hrs: "14–16" },
  { from: "Manali", to: "Kaza (Spiti)", km: 200, hrs: "6–8" },
];

function HowToReachContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80"
          alt="Travel to Himachal Pradesh"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-300 text-sm font-semibold uppercase tracking-widest block mb-2">Travel Guide</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              {destination ? `Reaching ${destination}` : "How to Reach"}
            </h1>
            <p className="text-white/70 text-sm max-w-lg">
              {destination 
                ? `Everything you need to know about traveling to ${destination} in Himachal Pradesh`
                : "Complete travel guide to reach Himachal Pradesh by air, train, and road"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {destination && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 p-6 bg-sky-500/10 border border-sky-500/20 rounded-3xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">Planning your trip to {destination}</h3>
                <p className="text-sm text-[var(--text-secondary)]">Check out the most suitable transport modes below for your journey.</p>
              </div>
            </div>
          </motion.div>
        )}
        {/* Route Cards */}
        {routes.map((route, ri) => (
          <motion.div
            key={route.mode}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ri * 0.15 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${route.color} flex items-center justify-center shadow-lg`}>
                <route.icon className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {route.mode}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Airports/Stations */}
              <div className="space-y-3">
                {route.airports.map((a) => (
                  <div key={a.name} className={`${route.bg} rounded-2xl p-5 border border-[var(--border)]`}>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] text-sm">{a.name}</h4>
                        <p className="text-[var(--text-secondary)] text-xs mt-0.5">{a.desc}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-600 dark:text-amber-400 text-xs font-medium">{a.dist}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                <h4 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Pro Tips
                </h4>
                <ul className="space-y-3">
                  {route.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-sky-500 mt-0.5 flex-shrink-0">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Distance Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
            🗺️ Distance Reference
          </h2>
          <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50 dark:bg-sky-900/20">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">From</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">To</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Distance</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {distances.map((d, i) => (
                    <tr key={`${d.from}-${d.to}`} className={`${i % 2 === 0 ? "bg-[var(--bg-secondary)]" : "bg-gray-50 dark:bg-gray-800/30"}`}>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">{d.from}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{d.to}</td>
                      <td className="px-6 py-4">
                        <span className="text-sky-500 font-bold text-sm">{d.km} km</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3" /> {d.hrs} hrs
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Important Travel Alerts</h4>
              <ul className="space-y-1.5 text-sm text-amber-700 dark:text-amber-400">
                <li>• Spiti Valley via Rohtang is accessible Jun–Oct. Via Kinnaur (NH5) Jun–Nov.</li>
                <li>• Inner Line Permit (ILP) mandatory for Kinnaur, Spiti, and border areas.</li>
                <li>• Monsoon (Jul–Sep): Landslide risk on mountain roads. Check road conditions on HRTC website.</li>
                <li>• Keep emergency contacts: HPPCL Helpline 1800-180-8060, Tourist Helpline 1364.</li>
                <li>• Carry altitude sickness medication (Diamox) for trips above 3500m.</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Maps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
            📍 Route Visualization
          </h2>
          <div className="map-container h-96 shadow-xl">
            <iframe
              title="Himachal Pradesh Route Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1461891.6684261!2d76.8619286!3d31.4924038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function HowToReachPage() {
  return (
    <Suspense fallback={<div>Loading travel guide...</div>}>
      <HowToReachContent />
    </Suspense>
  );
}
