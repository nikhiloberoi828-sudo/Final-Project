"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Search, ChevronDown, X } from "lucide-react";
import { hotelsByDistrict, districtHotelKeys, type Hotel } from "@/lib/data";
import BookingModal from "@/components/BookingModal";

function HotelCard({ hotel, onBook }: { hotel: Hotel; onBook: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)] card-hover"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs bg-sky-500 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
            {hotel.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-amber-500 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {hotel.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--text-primary)] text-base leading-tight mb-1.5 line-clamp-1">
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 text-sky-500 flex-shrink-0" />
          <span className="text-xs text-[var(--text-secondary)]">{hotel.district}</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
          {hotel.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
              {a}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs text-sky-500">+{hotel.amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">starting from</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
              ₹{hotel.price.toLocaleString()}
              <span className="text-xs font-normal text-[var(--text-secondary)]">/night</span>
            </p>
          </div>
          <button
            onClick={onBook}
            className="btn-primary !text-sm !px-5 !py-2.5"
            id={`book-${hotel.id}`}
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AccommodationContent() {
  const searchParams = useSearchParams();
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const district = searchParams.get("district");
    if (district && districtHotelKeys.includes(district as any)) {
      setSelectedDistrict(district);
    }
  }, [searchParams]);

  const allHotels = Object.values(hotelsByDistrict).flat();

  const filtered = allHotels.filter((h) => {
    if (selectedDistrict !== "all" && h.district !== selectedDistrict) return false;
    if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Group by district
  const grouped = sorted.reduce((acc, h) => {
    if (!acc[h.district]) acc[h.district] = [];
    acc[h.district].push(h);
    return acc;
  }, {} as Record<string, Hotel[]>);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image
          src="/assets/dest_Naggar Castle.jpg"
          alt="Accommodation in Himachal Pradesh"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-300 text-sm font-semibold uppercase tracking-widest block mb-2">Where to Stay</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Accommodation</h1>
            <p className="text-white/70 text-sm max-w-lg">
              {allHotels.length}+ hotels, resorts & homestays across {districtHotelKeys.length} districts of Himachal Pradesh
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="top-20 z-30 bg-[var(--bg-secondary)] rounded-2xl shadow-lg border border-[var(--border)] p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-sky-500" />
              <input
                type="text"
                id="hotelSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <select
              id="districtSelect"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] text-sm px-4 py-2.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              <option value="all">All Districts</option>
              {districtHotelKeys.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-[var(--text-primary)] text-sm px-4 py-2.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: Highest</option>
            </select>
          </div>

          {/* District chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedDistrict("all")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectedDistrict === "all" ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] hover:text-sky-500"}`}
            >
              All
            </button>
            {districtHotelKeys.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectedDistrict === d ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] hover:text-sky-500"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--text-secondary)] text-sm">
            Showing <span className="font-bold text-[var(--text-primary)]">{sorted.length}</span> properties
          </p>
        </div>

        {/* Grouped listings */}
        {Object.entries(grouped).map(([district, hotels]) => (
          <div key={district} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{district}</h2>
              <span className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full">
                {hotels.length} properties
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onBook={() => setBookingHotel(hotel)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingHotel && (
        <BookingModal
          isOpen={!!bookingHotel}
          onClose={() => setBookingHotel(null)}
          hotelName={bookingHotel.name}
          hotelPrice={bookingHotel.price}
          district={bookingHotel.district}
        />
      )}
    </div>
  );
}

export default function AccommodationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AccommodationContent />
    </Suspense>
  );
}
