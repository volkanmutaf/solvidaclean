// src/components/QuoteForm.jsx

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import QuoteSuccessModal from "./QuoteSuccessModal";

export function QuoteForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  const [customText, setCustomText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState("");

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    if (e.target.value !== "Custom") setCustomText("");
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selected = files.slice(0, 10);
      const uploadPromises = selected.map((file) => uploadToCloudinary(file));
      const imageUrls = await Promise.all(uploadPromises);
      const currentYear = new Date().getFullYear();
      const quoteSnapshot = await getDocs(collection(db, "quotes"));
      const quoteNumber = `Q${currentYear}-${String(quoteSnapshot.size + 1).padStart(5, "0")}`;

      await addDoc(collection(db, "quotes"), {
        name,
        email,
        phone,
        service: selectedService === "Custom" ? customText : selectedService,
        message,
        imageUrls,
        bedrooms,
        bathrooms,
        quoteNumber,
        timestamp: serverTimestamp(),
        read: false,
      });

      setName("");
      setEmail("");
      setPhone("");
      setSelectedService("");
      setCustomText("");
      setMessage("");
      setFiles([]);
      setFileNames([]);
      setBedrooms(1);
      setBathrooms(1);
      setQuoteNumber(quoteNumber);
      setShowSuccessModal(true);
      e.target.reset();
    } catch (err) {
      console.error("Error submitting quote:", err);
      alert("Failed to send quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Section'a padding ve arka plan şeffaflığı.
    <section id="quotes-form" className=" py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-1">{t("quoteForm.headline")}</h1>
        <h2 className="text-lg text-gray-700">{t("quoteForm.subheadline")}</h2>
      </div>

      {/* FORM KAPSAYICISI: Buraya arka plan ve diğer stil ekledik */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
        encType="multipart/form-data"
      >

        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("quoteForm.namePlaceholder")}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
          required
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("quoteForm.emailPlaceholder")}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
          required
        />

        <input
          type="tel"
          inputMode="numeric"
          maxLength={14}
          value={phone}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
            let formatted = "";
            if (raw.length >= 1) {
              formatted = "(" + raw.slice(0, 3);
              if (raw.length >= 4) {
                formatted += ") " + raw.slice(3, 6);
                if (raw.length >= 7) {
                  formatted += "-" + raw.slice(6, 10);
                }
              }
            }
            setPhone(formatted);
          }}
          placeholder={t("quoteForm.phonePlaceholder")}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
        />

        <select
          name="service"
          value={selectedService}
          onChange={handleServiceChange}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
          required
        >
          <option value="">{t("quoteForm.selectServicePlaceholder")}</option>
          <option value="Residential Cleaning">{t("residential.title")}</option>
          <option value="Office Cleaning">{t("office.title")}</option>
          <option value="Deep Cleaning">{t("deepclean.title")}</option>
          <option value="Turnaround Cleaning Services">{t("airbnb.title")}</option>
          <option value="Post-Construction Cleaning">{t("postconst.title")}</option>
          <option value="Move-In/Out Cleaning">{t("moveout.title")}</option>
          <option value="Custom">{t("quoteForm.customService")}</option>
        </select>

        {selectedService === "Custom" && (
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

        {/* Yatak Odası ve Banyo Sayaçları Kapsayıcısı */}
        <div className="flex justify-between col-span-2 gap-4">
          {/* Yatak Odası Sayacı */}
          <div className="flex items-center bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 w-full text-gray-700 shadow-sm">
            <button
              type="button"
              onClick={() => setBedrooms((prev) => Math.max(0, prev - 1))}
              className="text-2xl text-[#00BFA6] px-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold text-lg">🛏️ {bedrooms} {t("quoteForm.bedroom")}</span>
            <button
              type="button"
              onClick={() => setBedrooms((prev) => prev + 1)}
              className="text-2xl text-[#00BFA6] px-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              +
            </button>
          </div>

          {/* Banyo Sayacı */}
          <div className="flex items-center bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 w-full text-gray-700 shadow-sm">
            <button
              type="button"
              onClick={() => setBathrooms((prev) => Math.max(0, prev - 1))}
              className="text-2xl text-[#00BFA6] px-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold text-lg">🛁 {bathrooms} {t("quoteForm.bathroom")}</span>
            <button
              type="button"
              onClick={() => setBathrooms((prev) => prev + 1)}
              className="text-2xl text-[#00BFA6] px-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Notes Toggle Button */}
        <div className="col-span-2 text-center">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 flex items-center justify-center gap-1 mx-auto"
          >
            <span>Add notes or special instructions</span>
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

        {/* Notes Textarea - Hidden by default */}
        <div className={`col-span-2 overflow-hidden transition-all duration-300 ease-in-out ${showNotes ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
          <textarea
            name="message"
            value={message}
            onChange={(e) => {
              const input = e.target.value;
              if (input.length <= 1500) setMessage(input);
            }}
            placeholder="Write any additional notes here (optional)"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-[#00796B] focus:border-[#00796B] transition-all duration-200 resize-none"
          />
          <p className="text-right text-xs text-gray-500 mt-1">{message.length} / 1500</p>
        </div>

        <label className="block col-span-2">
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
          <ul className="text-sm text-gray-500 ml-2 list-decimal pl-4">
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

        <div className="text-center col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00BFA6] hover:bg-[#00796B] text-white font-semibold py-3 px-6 rounded-md transition"
          >
            {loading ? t("quoteForm.submitting") : t("quoteForm.submit")}
          </button>
        </div>

        <div className="mt-8 col-span-2 w-full flex justify-center items-center flex-wrap gap-x-10 gap-y-2 text-sm text-gray-700 text-center">
          <div className="flex items-center gap-1 whitespace-nowrap">⭐️⭐️⭐️⭐️⭐️ <span>{t("quoteForm.fiveStar")}</span></div>
          <div className="flex items-center gap-1 whitespace-nowrap">✅ <span>{t("quoteForm.trusted")}</span></div>
          <div className="flex items-center gap-1 whitespace-nowrap">🛡️ <span>{t("quoteForm.guarantee")}</span></div>
        </div>
      </form>

      {/* Success Modal */}
      <QuoteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/");
        }}
        quoteNumber={quoteNumber}
      />
    </section>
  );
}