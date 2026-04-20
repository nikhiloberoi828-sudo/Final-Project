"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const SafeImage = ({ src, alt, fallbackSrc = "/assets/placeholder.jpg", className, ...props }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | any>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const cleanSrc = (source: any): string => {
      if (!source) return fallbackSrc;
      let s = typeof source === "string" ? source : source.src || "";
      
      // Remote URLs: let them be, but we'll catch errors
      if (s.startsWith("http")) return s;

      // Clean local paths
      // 1. Remove /public prefix if it exists
      if (s.startsWith("/public/")) {
        s = s.replace("/public", "");
      } else if (s.startsWith("public/")) {
        s = s.replace("public", "");
      }

      // 2. Ensure leading slash
      if (!s.startsWith("/")) {
        s = "/" + s;
      }

      // 3. If it doesn't already have assets prefix but looks like a local image name
      if (!s.startsWith("/assets/") && !s.includes("://")) {
        s = "/assets" + (s.startsWith("/") ? "" : "/") + s;
      }
      
      // Double check prefix consistency (ensure single /assets/)
      s = s.replace(/\/assets\/assets\//g, "/assets/");

      // 4. Encode spaces properly for Next.js Image loader
      // We use encodeURI but being careful not to double-encode
      return encodeURI(decodeURI(s));
    };

    setImgSrc(cleanSrc(src));
    setError(false);
  }, [src, fallbackSrc]);

  if (error || !imgSrc) {
    return (
      <div className={`relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={fallbackSrc}
          alt={alt || "Fallback"}
          className="object-cover w-full h-full opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px] font-medium px-1 text-center">
          Preview
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        console.warn(`Image failed to load: ${imgSrc}, falling back.`);
        setError(true);
      }}
    />
  );
};

export default SafeImage;
