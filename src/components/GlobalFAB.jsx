import React, { useState, useEffect } from "react";
import { Phone, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function GlobalFAB() {
  const [showFAB, setShowFAB] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        setShowFAB(true);
      } else {
        setShowFAB(false);
        setTimeout(() => setShowFAB(false), 800); // match transition duration
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-4 bottom-6 z-50 flex flex-col gap-2 items-start transition-all duration-1000 ease-in-out
        ${showFAB ? 'opacity-100 translate-y-0 pointer-events-auto animate-slide-up-fab' : 'opacity-0 translate-y-16 pointer-events-none'}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <a
        href="tel:(617) 202-1372"
        className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        style={{ minWidth: 120 }}
      >
        <Phone className="w-4 h-4" />
        {t('globalFAB.phoneLabel')}
      </a>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ minWidth: 120 }}
        onClick={() => {
          navigate("/quote#quote-form");
        }}
      >
        <Send className="w-4 h-4" />
        {t('globalFAB.getQuote')}
      </button>
    </div>
  );
} 