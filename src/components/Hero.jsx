// src/components/Hero.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import QuoteSuccessModal from "./QuoteSuccessModal";
import {
  BedDouble,
  ShowerHead,
  Minus,
  Plus,
  Phone,
  Send,
  ArrowUp
} from "lucide-react";


export function Hero() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [message, setMessage] = useState("");
  const [customText, setCustomText] = useState("");
  const [showFAB, setShowFAB] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedQuoteNumber, setSubmittedQuoteNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const scrollAnimRef = useRef();

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    const response = await fetch("https://api.cloudinary.com/v1_1/dfodqh4rp/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary response:", errorText);
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const scrollToTop = () => {
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
    }
    const scrollStep = () => {
      const distance = window.scrollY;
      if (distance > 0) {
        window.scrollTo(0, distance - distance / 12);
        scrollAnimRef.current = requestAnimationFrame(scrollStep);
      } else {
        scrollAnimRef.current = null;
      }
    };
    scrollAnimRef.current = requestAnimationFrame(scrollStep);
  };

  useEffect(() => {
    const handleUserScroll = () => {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    };
    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
    };
  }, []);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.dir = i18n.dir(currentLang);
  }, [i18n, i18n.language]);

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

  const handleHeroFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload photos to Cloudinary first
      const selected = files.slice(0, 10);
      const uploadPromises = selected.map((file) => uploadToCloudinary(file));
      const imageUrls = await Promise.all(uploadPromises);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/submit-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          service: customText, // Use selected service or custom text
          message: message,
          bedrooms,
          bathrooms,
          imageUrls, // Include uploaded image URLs
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save to Firebase after server call succeeds
        try {
          const quoteData = {
            name,
            email,
            phone,
            service: customText || "General Cleaning",
            message: message || "",
            imageUrls,
            bedrooms,
            bathrooms,
            quoteNumber: data.quoteNumber,
            timestamp: serverTimestamp(),
            read: false,
          };

          await addDoc(collection(db, "quotes"), quoteData);
          console.log("📝 Quote saved to Firebase successfully");
        } catch (firebaseErr) {
          console.error("Firebase save error:", firebaseErr);
          // Don't show error to user since server call succeeded
        }

        setName("");
        setEmail("");
        setPhone("");
        setBedrooms(1);
        setBathrooms(1);
        setMessage(""); // Clear message after submission
        setFiles([]);
        setFileNames([]);
        setCustomText("");
        // setShowNotes(false); // Keep notes open to maintain visual alignment
        
        // Show success modal
        setSubmittedQuoteNumber(data.quoteNumber);
        setShowSuccessModal(true);
      } else {
        setError(data.error || t("quoteForm.errorMessage"));
      }
    } catch (err) {
      console.error("Hero form error:", err);
      setError(t("quoteForm.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
<section className="w-full bg-[#2563eb] flex items-start justify-center px-4 md:px-8 relative min-h-[600px] -mt-4 md:-mt-6 z-0">
{/* Decorative bubbles/drops background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {/* Decorative SVG background */}
        <img
          src="/src/assets/cleaningequipments.svg"
          alt="Cleaning Equipments Decorative"
          className="absolute right-0 top-1/4 w-[600px] max-w-none opacity-10 pointer-events-none select-none z-0"
          draggable={false}
        />
        {/* Right-side bubbles/drops (more concentrated) */}
        <span className="absolute top-10 right-1/4 opacity-20 text-5xl">🫧</span>
        <span className="absolute top-1/2 right-1/3 opacity-10 text-7xl">💧</span>
        <span className="absolute bottom-10 right-1/5 opacity-20 text-4xl">🫧</span>
        <span className="absolute top-1/3 right-10 opacity-10 text-6xl">💧</span>
        <svg className="absolute top-1/4 right-1/2 opacity-10 w-16 h-16" fill="none" viewBox="0 0 64 64">
          <ellipse cx="32" cy="32" rx="28" ry="16" fill="#fff" />
        </svg>
        <svg className="absolute bottom-1/4 right-1/3 opacity-20 w-10 h-10" fill="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="#fff" />
        </svg>
        <span className="absolute bottom-8 right-1/5 opacity-10 text-6xl">🫧</span>
        <span className="absolute top-6 right-1/6 opacity-10 text-4xl">🫧</span>
        <span className="absolute top-1/6 right-1/6 opacity-20 text-3xl">💧</span>
        <span className="absolute bottom-1/6 right-1/3 opacity-10 text-5xl">🫧</span>
        <svg className="absolute top-2/3 right-1/5 opacity-10 w-12 h-12" fill="none" viewBox="0 0 48 48">
          <ellipse cx="24" cy="24" rx="20" ry="10" fill="#fff" />
        </svg>
        <svg className="absolute bottom-1/5 right-1/6 opacity-20 w-8 h-8" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="#fff" />
        </svg>
        {/* A few on the left for balance */}
        <span className="absolute top-10 left-1/6 opacity-10 text-3xl">🫧</span>
        <span className="absolute bottom-1/4 left-1/5 opacity-10 text-4xl">💧</span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between pt-28 pb-2 gap-y-8 gap-x-6 min-h-[500px]">
        {/* LEFT CONTENT - This is your form container */}
        <div className="flex-1 min-w-0 flex flex-col items-start justify-start relative z-20"> {/* Added relative and z-20 */}
          <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-left">
            {t("quoteForm.headline")}
          </h1>
          <p className="text-white/90 text-base md:text-lg font-medium mb-7 text-left max-w-xl">
            {t("quoteForm.subheadline")} {t("quoteForm.freeQuoteText")}
          </p>

          <form
            onSubmit={handleHeroFormSubmit}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-3 relative z-20" /* Added relative and z-20 */
            encType="multipart/form-data"
          >
        {/* Unified input group: Name | Bedroom | Bathroom */}
        <div className="flex flex-row items-center bg-gray-100 border border-gray-200 rounded-lg px-2 py-0 w-full h-12 min-h-[48px]">
          {/* Name */}
          <input
            type="text"
            placeholder={t("quoteForm.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-grow bg-transparent border-none outline-none text-base placeholder-gray-400 min-w-[120px] h-full px-3"
          />
          <span className="mx-2 text-gray-400 text-lg select-none">|</span>
          {/* Bedroom */}
          <div className="flex items-center gap-1 min-w-fit">
            <button
              type="button"
              onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
              className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#2563eb] hover:bg-blue-100 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <BedDouble className="w-5 h-5 text-[#2563eb]" />
            <span className="text-base font-semibold text-gray-700">{bedrooms}</span>
            <span className="text-sm text-gray-700 ml-1 select-none">{t("quoteForm.bedroom")}</span>
            <button
              type="button"
              onClick={() => setBedrooms(bedrooms + 1)}
              className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#2563eb] hover:bg-blue-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="mx-2 text-gray-400 text-lg select-none">|</span>
          {/* Bathroom */}
          <div className="flex items-center gap-1 min-w-fit">
            <button
              type="button"
              onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
              className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#2563eb] hover:bg-blue-100 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <ShowerHead className="w-5 h-5 text-[#2563eb]" />
            <span className="text-base font-semibold text-gray-700">{bathrooms}</span>
            <span className="text-sm text-gray-700 ml-1 select-none">{t("quoteForm.bathroom")}</span>
            <button
              type="button"
              onClick={() => setBathrooms(bathrooms + 1)}
              className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#2563eb] hover:bg-blue-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

            {customText && (
              <input
                type="text"
                name="customText"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={t("quoteForm.customRequestPlaceholder")}
                className="col-span-2 p-3 border border-gray-300 rounded-lg shadow-sm w-full mt-[-12px]"
                required
              />
            )}

            {/* Email & Mobile as separate boxes with divider */}
            <div className="flex flex-col md:flex-row items-center w-full gap-2 mt-2">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder={t("quoteForm.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 min-w-[120px] focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="mx-2 text-gray-300 text-xl select-none hidden md:inline">|</span>
              <div className="flex-1">
                <input
                  type="tel"
                  placeholder={t("quoteForm.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                    let formatted = "";
                    if (raw.length > 0) { formatted = `(${raw.slice(0, 3)}`; }
                    if (raw.length >= 4) { formatted += `) ${raw.slice(3, 6)}`; }
                    if (raw.length >= 7) { formatted += `-${raw.slice(6, 10)}`; }
                    setPhone(formatted);
                  }}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 min-w-[120px] focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Optional notes & photo toggle */}
            <div className="col-span-2 text-center mt-2">
              <button
                type="button"
                onClick={() => setShowNotes((prev) => !prev)}
                className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 flex items-center justify-center gap-1 mx-auto"
              >
              <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 font-semibold">
                📝 {t("quoteForm.customRequestLabel")} & 🖼️ {t("quoteForm.photoLabel")}
                <span className="text-xs text-gray-500 ml-1 font-normal">({t("quoteForm.optional")})</span>
              </div>           
                  <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showNotes ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
            </div>
            <div className={`col-span-2 overflow-hidden transition-all duration-300 ease-in-out ${showNotes ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <textarea
                name="message"
                value={message}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input.length <= 1500) setMessage(input);
                }}
                placeholder={t("quoteForm.messagePlaceholder")}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-[#00796B] focus:border-[#00796B] transition-all duration-200 resize-none"
              />
              <p className="text-right text-xs text-gray-500 mt-1">{message.length} / 1500</p>
              <label className="block mt-2">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  {t("quoteForm.photoLabel")} (Max 10)
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    const currentFiles = [...files];
                    const currentFileNames = currentFiles.map(f => f.name);
                    
                    // Filter out files with duplicate names
                    const uniqueNewFiles = newFiles.filter(file => !currentFileNames.includes(file.name));
                    
                    // Add unique files up to the 10 file limit
                    const remainingSlots = 10 - currentFiles.length;
                    const filesToAdd = uniqueNewFiles.slice(0, remainingSlots);
                    
                    const updatedFiles = [...currentFiles, ...filesToAdd];
                    setFiles(updatedFiles);
                    setFileNames(updatedFiles.map((f) => f.name));
                    
                    // Reset the input value to allow selecting the same file again
                    e.target.value = '';
                  }}
                />
                <ul className="text-sm text-gray-500 ml-2 list-decimal pl-4 mt-1">
                  {fileNames.map((name, idx) => (
                    <li key={idx} className="flex items-center justify-between group">
                      <span className="flex-1">{name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = files.filter((_, fileIdx) => fileIdx !== idx);
                          setFiles(updatedFiles);
                          setFileNames(updatedFiles.map((f) => f.name));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Remove file"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00C853] hover:brightness-110 text-white font-bold py-3 rounded-lg text-lg transition-all duration-200 mt-1"
              disabled={loading}
            >
              {loading ? t("quoteForm.submitting") : t("quoteForm.submitButton")}
            </button>
            <div className="flex flex-nowrap justify-center items-center gap-1 sm:gap-2 text-gray-700 font-medium mt-4 px-1">
              {/* Mobile: Icons only */}
              <div className="flex items-center gap-1 sm:hidden">
                <span className="text-lg">🏆</span>
                <span className="text-lg">🌟</span>
                <span className="text-lg">🚫</span>
              </div>
              
              {/* Desktop: Full text */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 whitespace-nowrap">🏆 {t("hero.fiveStarRated")}</span>
                <span className="text-gray-300">|</span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">🌟 {t("hero.premiumQuality")}</span>
                <span className="text-gray-300">|</span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">🚫 {t("hero.noHiddenFees")}</span>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}


          </form>
        </div>



      </div>
      {/* Floating Action Buttons (FAB) */}
      <div
        className={`fixed left-4 bottom-6 z-50 flex flex-col gap-2 items-start transition-all duration-1000 ease-in-out
          ${showFAB ? 'opacity-100 translate-y-0 pointer-events-auto animate-slide-up-fab' : 'opacity-0 translate-y-16 pointer-events-none'}`}
        style={{ transitionProperty: 'opacity, transform' }}
      >
        <a
          href="tel:1234567890"
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ minWidth: 120 }}
        >
          <Phone className="w-4 h-4" />
          (617) 202-1372
        </a>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ minWidth: 120 }}
          onClick={() => {
            navigate("/quote#quote-form");
          }}
        >
          <Send className="w-4 h-4" />
          {t("globalFAB.getQuote")}
        </button>
      </div>
      {/* Scroll to Top Button - Only show when needed, before section closes */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 animate-slide-up-fab"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      
      {/* Success Modal */}
      <QuoteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setShowNotes(false); // Reset form to normal state when modal closes
        }}
        quoteNumber={submittedQuoteNumber}
      />
    </section>
  );
}