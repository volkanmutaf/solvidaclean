// src/components/ServiceAreas.jsx

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, MapPin, Search } from "lucide-react";
import { CITY_SERVICE_MAP } from "../data/cityServiceMap.js";
import { INITIAL_VISIBLE_CITIES } from "../data/initialVisibleCities.js";
import maMapImage from "../assets/ma-map.png";
import { useTranslation } from "react-i18next";
import ScrollToTop from "../components/ScrollToTop";

export default function ServiceAreas() {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const allCities = Object.entries(CITY_SERVICE_MAP).map(([name, data]) => ({
    name,
    served: data.served,
  }));

  const initial = allCities.filter((c) => INITIAL_VISIBLE_CITIES.includes(c.name));
  const filtered = allCities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const visibleCities = search.trim() ? filtered : initial;

  const popularCities = [
    "Boston",
    "Brookline",
    "Cambridge",
    "Everett",
    "Medford",
    "Newton",
    "Quincy",
    "Somerville",
    "Waltham",
    "Winchester",
    "Woburn",
  ].sort();

  const handleScrollOrNavigate = (e, id) => {
    e.preventDefault();
    const targetElementId = id;
    if (location.pathname === "/") {
      const element = document.getElementById(targetElementId);
      const header = document.querySelector("header");
      if (element) {
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.replaceState(null, null, `#${targetElementId}`);
      }
    } else {
      navigate(`/#${targetElementId}`);
    }
  };

  return (
    <>
      <ScrollToTop />
      {/* Changed background gradient to use primary and light for a less stark white */}
      <section className="bg-solvidaBg relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-16 px-2">
      {/* Header & Description */}
      <div className="max-w-3xl w-full mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">
          {t("serviceAreas.headline")}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-2 font-medium">
          {t("serviceAreas.description")}
        </p>
      </div>

      {/* Search & Popular Cities */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6 mb-10 items-stretch">
        <div className="flex-1 bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <label htmlFor="city-search" className="block text-lg font-semibold text-primary mb-2">
            <Search className="inline w-5 h-5 mr-2 align-middle" />
            {t("serviceAreas.searchPlaceholder")}
          </label>
          <input
            id="city-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("serviceAreas.searchPlaceholder")}
            className="w-full border border-accent/30 rounded-lg px-4 py-3 mb-4 shadow-sm focus:ring-2 focus:ring-primary text-gray-800 text-lg transition"
            autoComplete="off"
          />
          <div className="text-sm text-gray-500 italic mb-2">
            <span dangerouslySetInnerHTML={{ __html: t("serviceAreas.notServedNote") }} />
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-primary/80 to-dark/80 rounded-2xl shadow-lg p-6 flex flex-col justify-between text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> {t("serviceAreas.popularTitle")}
          </h2>
          <p className="text-sm mb-4 opacity-90">{t("serviceAreas.popularDescription")}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularCities.map((city) => (
              <Link
                key={city}
                to="/#quotes-form"
                onClick={(e) => handleScrollOrNavigate(e, "quotes-form")}
                className="px-4 py-2 rounded-full bg-white/90 text-primary font-semibold shadow hover:bg-primary hover:text-white transition-all border border-accent/30 hover:border-white"
                aria-label={`Get a Free Quote for ${city}`}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* City Cards Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {visibleCities.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">
            <span dangerouslySetInnerHTML={{ __html: t("serviceAreas.notServedNote") }} />
          </div>
        ) : (
          visibleCities.map(({ name, served }) => (
            <div
              key={name}
              className={`relative group rounded-2xl p-5 shadow-xl border-2 transition-all duration-300 flex flex-col items-start bg-white/90
                ${served ? "border-accent/40 hover:border-accent hover:shadow-2xl hover:scale-105 cursor-pointer" : "border-gray-200 opacity-70"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-gray-800 truncate">{name}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {served ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm font-medium ${served ? "text-green-700" : "text-red-500"}`}>
                  {served ? t("serviceAreas.served") : t("serviceAreas.notServed")}
                </span>
              </div>
              <div className="text-gray-600 text-sm mb-6 min-h-[40px]">
                {served ? t("serviceAreas.cardServed") : t("serviceAreas.cardNotServed")}
              </div>
              {served && (
                <Link
                  to="/#quotes-form"
                  onClick={(e) => handleScrollOrNavigate(e, "quotes-form")}
                  className="absolute inset-0 z-10"
                  aria-label={`Get a Free Quote for ${name}`}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Decorative Map Image (optional, can be commented out if not needed) */}
      <img
        src={maMapImage}
        alt="Massachusetts Map"
        className="absolute bottom-0 right-0 w-[320px] md:w-[420px] opacity-10 pointer-events-none select-none hidden md:block"
        style={{ zIndex: 1 }}
      />
    </section>
    </>
  );
}