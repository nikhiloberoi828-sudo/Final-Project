"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Heart, MapPin, Filter, Grid, List, X, Info, Calendar, Star, Activity, Map, ChevronRight, Hotel, Locate, ArrowRight, Share2 } from "lucide-react";
import { destinations, districts, categories, type Destination } from "@/lib/data";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

function DestinationCard({ dest, isFav, onToggleFav, onExplore }: { dest: Destination; isFav: boolean; onToggleFav: (id: string) => void; onExplore: (id: string) => void }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <motion.div
      layoutId={`card-${dest.id}`}
      className="group bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)] card-hover"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden pointer-events-none">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(dest.id); }}
          className="absolute top-3 right-3 w-8 h-8 glass-dark rounded-full flex items-center justify-center pointer-events-auto"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 transition-all ${isFav ? "fill-rose-500 text-rose-500" : "text-white"}`} />
        </button>
        <span className="absolute bottom-3 left-3 tag-badge text-xs bg-sky-500/90 border-sky-400 text-white">
          {dest.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] leading-tight">{dest.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-sky-500" />
              <span className="text-xs text-[var(--text-secondary)]">{dest.district}</span>
            </div>
          </div>
          <button onClick={() => setShowInfo(!showInfo)} className="w-7 h-7 rounded-full bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-500 hover:bg-sky-100 transition-colors">
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2 mb-4">
          {dest.description}
        </p>

        {/* Expandable info */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-sky-50 dark:bg-sky-900/10 rounded-xl text-xs text-[var(--text-secondary)] space-y-1.5 border border-sky-100 dark:border-sky-900/20 overflow-hidden"
            >
              <p><span className="font-medium text-[var(--text-primary)]">🚗 How to Reach:</span> {dest.howToReach}</p>
              <p><span className="font-medium text-[var(--text-primary)]">📅 Best Time:</span> {dest.bestTime}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
            dest.category === "adventure" ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" :
            dest.category === "cultural" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" :
            dest.category === "lake" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
            dest.category === "trek" ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
            dest.category === "pilgrimage" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" :
            "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400"
          }`}>
            {dest.category.replace(/-/g, " ")}
          </span>
          <button
            onClick={() => onExplore(dest.id)}
            className="text-sm font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
          >
            Explore →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ExpandedCard({ dest, onClose, onToggleFav, isFav }: { dest: Destination; onClose: () => void; onToggleFav: (id: string) => void; isFav: boolean }) {
  const [activeTab, setActiveTab] = useState<"overview" | "activities" | "nearby">("overview");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        layoutId={`card-${dest.id}`}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-secondary)] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Large Image */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="font-display text-3xl font-bold mb-1">{dest.name}</h2>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-sky-400" /> {dest.district}</span>
              {dest.altitude && <span className="flex items-center gap-1"><Locate className="w-4 h-4 text-sky-400" /> {dest.altitude}</span>}
            </div>
          </div>
          <button
            onClick={() => onToggleFav(dest.id)}
            className="absolute top-4 left-4 w-10 h-10 glass-dark rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <Heart className={`w-5 h-5 ${isFav ? "fill-rose-500 text-rose-500" : "text-white"}`} />
          </button>
        </div>

        {/* Right Side: Content & Tabs */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex border-b border-[var(--border)] px-6 pt-6">
            {(["overview", "activities", "nearby"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-semibold transition-all relative capitalize ${
                  activeTab === tab ? "text-sky-500" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab === "overview" ? "Overview" : tab === "activities" ? "Things to Do" : "Nearby"}
                {activeTab === tab && (
                  <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="min-h-full">
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">About this place</h4>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{dest.longDescription}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-900/30">
                      <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold text-sm">Best Time to Visit</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{dest.bestTime}</p>
                      {dest.seasonDetails && <p className="text-[10px] mt-2 text-sky-500 opacity-80">{dest.seasonDetails}</p>}
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                        <Star className="w-4 h-4" />
                        <span className="font-bold text-sm">Famous For</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{dest.famousFor || dest.tag}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "activities" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">Popular Activities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(dest.activities || ["Sightseeing", "Photography", "Trekking", "Local Food"]).map((act, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                          <Activity className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-sky-600 transition-colors">{act}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "nearby" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">Nearby Attractions</h4>
                  <div className="space-y-3">
                    {(dest.nearby || ["Local Market", "Viewpoint", "Sunset Point"]).map((near, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-[var(--border)] group hover:border-sky-500/30 transition-all">
                        <div className="flex items-center gap-3">
                          <Map className="w-4 h-4 text-sky-500" />
                          <span className="text-sm font-medium">{near}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/20 border-t border-[var(--border)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/accommodation?district=${dest.district}`}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border)] hover:shadow-md hover:border-sky-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-tighter text-sky-500">Plan Stay</p>
                    <p className="text-sm font-bold">Places to Stay</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/how-to-reach"
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border)] hover:shadow-md hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Locate className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-tighter text-emerald-500">Guide</p>
                    <p className="text-sm font-bold">How to Reach</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DestinationsContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("cat") || "all");
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get("district") || "all");
  const [viewFavorites, setViewFavorites] = useState(searchParams.get("view") === "favorites");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(searchParams.get("id"));

  useEffect(() => {
    setExpandedId(searchParams.get("id"));
  }, [searchParams]);

  // Sync state with URL changes (for navigation via navbar)
  useEffect(() => {
    setSelectedCat(searchParams.get("cat") || "all");
    setSelectedDistrict(searchParams.get("district") || "all");
    setQuery(searchParams.get("q") || "");
    setViewFavorites(searchParams.get("view") === "favorites");
  }, [searchParams]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    toast.success(favorites.includes(id) ? "Removed from favorites" : "❤️ Added to favorites!");
  };

  const filtered = destinations.filter((d) => {
    if (viewFavorites && !favorites.includes(d.id)) return false;
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.district.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedCat !== "all" && d.category !== selectedCat) return false;
    if (selectedDistrict !== "all" && d.district !== selectedDistrict) return false;
    return true;
  });

  // Group by district
  const grouped = filtered.reduce((acc, dest) => {
    if (!acc[dest.district]) acc[dest.district] = [];
    acc[dest.district].push(dest);
    return acc;
  }, {} as Record<string, Destination[]>);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Expanded View Modal */}
      <AnimatePresence>
        {expandedId && destinations.find(d => d.id === expandedId) && (
          <ExpandedCard 
            dest={destinations.find(d => d.id === expandedId)!} 
            onClose={() => setExpandedId(null)}
            onToggleFav={toggleFavorite}
            isFav={favorites.includes(expandedId)}
          />
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80"
          alt="Destinations"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-300 text-sm font-semibold uppercase tracking-widest block mb-2">Explore</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              {viewFavorites ? "❤️ Saved Trips" : "Destinations"}
            </h1>
            <p className="text-white/70 text-sm max-w-lg">
              {viewFavorites
                ? "Your hand-picked collection of Himachal Pradesh destinations"
                : `Discover ${destinations.length}+ incredible places across 12 districts of Himachal Pradesh`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="sticky top-20 z-30 bg-[var(--bg-secondary)] rounded-2xl shadow-lg border border-[var(--border)] p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <input
                type="text"
                id="destSearch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations or districts..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              id="catFilter"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] text-sm px-4 py-2.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50 min-w-36"
            >
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            {/* District */}
            <select
              id="districtFilter"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] text-sm px-4 py-2.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50 min-w-36"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Favorites toggle */}
            <button
              onClick={() => setViewFavorites(!viewFavorites)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                viewFavorites
                  ? "bg-rose-500 text-white"
                  : "bg-gray-50 dark:bg-gray-800 text-[var(--text-secondary)] hover:text-rose-500"
              }`}
              id="favoritesToggle"
            >
              <Heart className={`w-4 h-4 ${viewFavorites ? "fill-white" : ""}`} />
              Saved ({favorites.length})
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCat(c.value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCat === c.value
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-500"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--text-secondary)] text-sm">
            Found <span className="font-bold text-[var(--text-primary)]">{filtered.length}</span> destinations
            {viewFavorites ? " in your saved trips" : ""}
          </p>
          {(query || selectedCat !== "all" || selectedDistrict !== "all") && (
            <button
              onClick={() => { setQuery(""); setSelectedCat("all"); setSelectedDistrict("all"); }}
              className="text-xs text-sky-500 hover:text-sky-600 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Grouped by district */}
        {Object.entries(grouped).map(([district, dests]) => (
          <div key={district} id={`district-${district.toLowerCase().replace(/\s+/g, "-")}`} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{district} District</h2>
              <span className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full">
                {dests.length} places
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {dests.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  isFav={favorites.includes(dest.id)}
                  onToggleFav={toggleFavorite}
                  onExplore={(id) => setExpandedId(id)}
                />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{viewFavorites ? "❤️" : "🔍"}</div>
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
              {viewFavorites ? "No saved destinations yet" : "No destinations found"}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {viewFavorites
                ? "Start exploring and save your favorite places!"
                : "Try adjusting your search or filters"}
            </p>
            <Link href="/destinations" onClick={() => { setQuery(""); setSelectedCat("all"); setSelectedDistrict("all"); setViewFavorites(false); }} className="btn-primary">
              Browse All Destinations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="skeleton w-32 h-8" /></div>}>
      <DestinationsContent />
    </Suspense>
  );
}
