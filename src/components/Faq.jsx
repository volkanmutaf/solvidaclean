// src/components/FAQ.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Minus, Star, Sparkles } from "lucide-react";

export default function FAQ() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // FAQ data with translation keys
  const faqKeys = [
    "howItWorks",
    "worthIt", 
    "getQuote",
    "whatsIncluded",
    "supplies",
    "greenCleaning",
    "payment",
    "cost",
    "problem",
    "refund",
    "cancellation",
    "beHome",
    "howManyCleaners",
    "whenCharged",
    "tipping",
    "whatNotClean",
    "sameCleaner",
    "feedback"
  ];

  return (
    <section className="bg-[#2563EB] pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full mb-6">
            <span className="text-white font-semibold text-lg">{t("faq.title")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("faq.headline")}
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t("faq.subtitle")} <a href="/contact" className="text-white font-semibold hover:underline">{t("faq.contactLink")}</a> {t("faq.contactLinkText")}
          </p>
        </div>

        {/* Main FAQ Layout - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Side - FAQ Content */}
          <div className="space-y-4">
            {faqKeys.slice(0, Math.ceil(faqKeys.length / 2)).map((key, index) => (
              <div key={`faq-${key}-${index}`} className="border-b border-white/20 pb-4">
                <button
                  onClick={() => toggle(index)}
                  className={`w-full text-left group focus:outline-none transition-all duration-300 ${
                    activeIndex === index
                      ? "text-white"
                      : "text-white/90 hover:text-white"
                  }`}
                  aria-expanded={activeIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className={`font-semibold text-lg leading-relaxed pr-4 transition-colors duration-200 ${
                      activeIndex === index
                        ? "text-white"
                        : "text-white/90 group-hover:text-white"
                    }`}>
                      {t(`faq.questions.${key}.question`)}
                    </h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      activeIndex === index
                        ? "bg-white text-[#2563EB]"
                        : "bg-white/20 text-white group-hover:bg-white group-hover:text-[#2563EB]"
                    }`}>
                      {activeIndex === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {activeIndex === index && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="mt-4 pl-0"
                  >
                    <div className="bg-white/10 rounded-lg p-6 border-l-4 border-white">
                      <p className="text-white/90 text-base leading-relaxed">
                        {t(`faq.questions.${key}.answer`)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - FAQ Content + Images */}
          <div className="space-y-6">
            
            {/* FAQ Questions - Right Column */}
            <div className="space-y-4">
              {faqKeys.slice(Math.ceil(faqKeys.length / 2)).map((key, index) => {
                const actualIndex = Math.ceil(faqKeys.length / 2) + index;
                return (
                  <div key={`faq-${key}-${actualIndex}`} className="border-b border-white/20 pb-4">
                    <button
                      onClick={() => toggle(actualIndex)}
                      className={`w-full text-left group focus:outline-none transition-all duration-300 ${
                        activeIndex === actualIndex
                          ? "text-white"
                          : "text-white/90 hover:text-white"
                      }`}
                      aria-expanded={activeIndex === actualIndex}
                      aria-controls={`faq-answer-${actualIndex}`}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className={`font-semibold text-lg leading-relaxed pr-4 transition-colors duration-200 ${
                          activeIndex === actualIndex
                            ? "text-white"
                            : "text-white/90 group-hover:text-white"
                        }`}>
                          {t(`faq.questions.${key}.question`)}
                        </h3>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                          activeIndex === actualIndex
                            ? "bg-white text-[#2563EB]"
                            : "bg-white/20 text-white group-hover:bg-white group-hover:text-[#2563EB]"
                        }`}>
                          {activeIndex === actualIndex ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {activeIndex === actualIndex && (
                      <div
                        id={`faq-answer-${actualIndex}`}
                        role="region"
                        aria-labelledby={`faq-question-${actualIndex}`}
                        className="mt-4 pl-0"
                      >
                        <div className="bg-white/10 rounded-lg p-6 border-l-4 border-white">
                          <p className="text-white/90 text-base leading-relaxed">
                            {t(`faq.questions.${key}.answer`)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/10 rounded-2xl p-8 text-white border border-white/20">
            <h3 className="text-2xl font-bold mb-4">{t("faq.cta.title")}</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {t("faq.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-[#2563EB] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                {t("faq.cta.contactButton")}
              </a>
              <a
                href="/quote"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2563EB] transition-colors duration-200"
              >
                {t("faq.cta.quoteButton")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}