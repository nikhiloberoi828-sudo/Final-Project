"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { galleryImages } from "../../lib/data";

const galleryCategories = ["all", "mountains", "lakes", "temples", "villages"];

export default function GalleryPage() {
  const [selected, setSelected] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = galleryImages.filter((img) => selected === "all" || img.category === selected);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=1600&q=80"
          alt="Gallery"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-300 text-sm font-semibold uppercase tracking-widest block mb-2">Visual Journey</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Photo Gallery</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                selected === cat
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-sky-400 hover:text-sky-500"
              }`}
            >
              {cat === "all" ? "🏔️ All" : cat === "mountains" ? "⛰️ Mountains" : cat === "lakes" ? "🏖️ Lakes" : cat === "temples" ? "🛕 Temples" : "🏘️ Villages"}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="masonry-item group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => setLightbox(img.src)}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium">{img.caption}</p>
                  <p className="text-sky-300 text-xs capitalize">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full"
            >
              <Image
                src={lightbox}
                alt="Gallery image"
                width={1200}
                height={800}
                className="rounded-2xl object-contain max-h-[85vh] w-full"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
