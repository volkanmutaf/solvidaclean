// FILE: src/components/LogoMarquee.jsx

import React from "react";

const logos = [
  { src: "1a.png", alt: "BBB" },
  { src: "2a.png", alt: "Best Cleaner Awards" },
  { src: "3a.png", alt: "Speed Cleaning Certified" },
  { src: "4a.png", alt: "Google 5 Star" },
  { src: "5a.png", alt: "Yelp" },
  { src: "7a.png", alt: "Background Porch" },
  { src: "8a.png", alt: "Proud Partners" },
  { src: "9a.png", alt: "Chamber of Commerce" },
  { src: "10a.png", alt: "Featured Porch" },
  { src: "6a.png", alt: "Expertise.com" }
];

export function LogoMarquee() {
  return (
    <div className="bg-[#001F3F] overflow-hidden py-8 relative">
      {/* Semi-transparent backdrop for better logo visibility */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>
      
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#001F3F] to-transparent z-10 pointer-events-none"></div>
      
      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#001F3F] to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex animate-marquee min-w-full relative z-20">
        {/* Original Logo Set */}
        {logos.map((logoItem, idx) => (
          <div
            key={`original-${idx}`}
            className="flex-shrink-0 w-28 h-16 md:w-36 md:h-20 flex items-center justify-center mx-4 md:mx-6"
          >
            <img
              src={`/src/assets/logos/${logoItem.src}`}
              alt={logoItem.alt || `Logo ${idx + 1}`}
              className="object-contain max-w-full max-h-full transition-transform duration-300 hover:scale-105 drop-shadow-md"
            />
          </div>
        ))}

        {/* Duplicated Logo Set for seamless loop */}
        {logos.map((logoItem, idx) => (
          <div
            key={`duplicate-${idx}`}
            className="flex-shrink-0 w-28 h-16 md:w-36 md:h-20 flex items-center justify-center mx-4 md:mx-6"
          >
            <img
              src={`/src/assets/logos/${logoItem.src}`}
              alt={logoItem.alt || `Logo ${idx + 1}`}
              className="object-contain max-w-full max-h-full transition-transform duration-300 hover:scale-105 drop-shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}