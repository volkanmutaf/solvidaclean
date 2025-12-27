// src/pages/QuotePage.jsx
import React, { useEffect, useState } from "react";
import { QuoteForm } from "../components/QuoteForm";
import { Sparkles, Clock, Shield, Star, CheckCircle, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QuotePage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: t("quotePage.benefitsSection.guarantee.title"),
      description: t("quotePage.benefitsSection.guarantee.description")
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("quotePage.benefitsSection.satisfaction.title"),
      description: t("quotePage.benefitsSection.satisfaction.description")
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: t("quotePage.benefitsSection.rated.title"),
      description: t("quotePage.benefitsSection.rated.description")
    }
  ];

  const testimonials = [
    {
      text: t("quotePage.testimonials.items.0.text"),
      author: t("quotePage.testimonials.items.0.author"),
      rating: t("quotePage.testimonials.items.0.rating")
    },
    {
      text: t("quotePage.testimonials.items.1.text"),
      author: t("quotePage.testimonials.items.1.author"),
      rating: t("quotePage.testimonials.items.1.rating")
    },
    {
      text: t("quotePage.testimonials.items.2.text"),
      author: t("quotePage.testimonials.items.2.author"),
      rating: t("quotePage.testimonials.items.2.rating")
    }
  ];

  return (
                                                                               <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 m-0 p-0 !mt-0 !pt-0">
              {/* Main Form Section - Primary Focus */}
                                                                                                                                       <section className="pt-20 sm:pt-24 md:pt-[120px] pb-12 sm:pb-16 px-2 sm:px-4 m-0">
        <div className="max-w-7xl mx-auto">
                     {/* Header */}
           <div className={`text-center mb-6 sm:mb-8 mt-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
               {t("quotePage.mainHeading")}
             </h1>

            {/* Progress Indicator */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">1</div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">{t("quotePage.progressSteps.fillForm")}</span>
              </div>
              <div className="w-6 sm:w-12 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs sm:text-sm font-bold">2</div>
                <span className="text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">{t("quotePage.progressSteps.getQuote")}</span>
              </div>
              <div className="w-6 sm:w-12 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs sm:text-sm font-bold">3</div>
                <span className="text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">{t("quotePage.progressSteps.bookService")}</span>
              </div>
            </div>
          </div>

          {/* Form Container - Primary Focus */}
          <div className={`max-w-4xl mx-auto mb-8 sm:mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-100">
              <QuoteForm />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-gray-500 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">{t("quotePage.trustIndicators.licensedInsured")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">{t("quotePage.trustIndicators.backgroundChecked")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">{t("quotePage.trustIndicators.fiveStarRated")}</span>
              </div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className={`text-center mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <span className="text-sm">{t("quotePage.scrollIndicator")}</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

             {/* Supporting Content Section */}
               <section className="py-8 sm:py-12 md:py-16 px-2 sm:px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Benefits Grid */}
          <div className={`mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8 md:mb-12 px-2">{t("quotePage.benefitsSection.title")}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t("quotePage.testimonials.title")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex justify-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic text-center">"{testimonial.text}"</p>
                  <p className="text-sm font-semibold text-gray-900 text-center">— {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("quotePage.finalCta.title")}</h3>
            <p className="text-lg text-gray-600 mb-6">
              {t("quotePage.finalCta.description")}
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 touch-manipulation min-h-[48px]"
            >
              {t("quotePage.finalCta.button")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
