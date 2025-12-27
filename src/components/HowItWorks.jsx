// HowItWorks.jsx
import { Calendar, Sparkles, Coffee, ArrowRight, ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const steps = sectionRef.current?.querySelectorAll(".step-card");
    steps?.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      title: t("howItWorks.bookTitle", "Book"),
      caption: t("howItWorks.bookCaption", "Choose your date and we'll be there, right on time."),
      icon: <Calendar className="w-12 h-12" />, 
      emoji: ""
    },
    {
      title: t("howItWorks.cleanTitle", "Clean"),
      caption: t("howItWorks.cleanCaption", "Our experts bring the sparkle — room by room."),
      icon: <Sparkles className="w-12 h-12" />, 
      emoji: ""
    },
    {
      title: t("howItWorks.relaxTitle", "Relax"),
      caption: t("howItWorks.relaxCaption", "Breathe easy in your freshly cleaned space."),
      icon: <Coffee className="w-12 h-12" />, 
      emoji: ""
    }
  ];

  return (
    <section className="pt-8 pb-20 bg-[#2563EB] overflow-hidden -mt-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 pt-0">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("howItWorks.header", "How SolVida Clean Works")}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
            {t("howItWorks.subheader", "Simple, reliable, and stress-free cleaning service in just three easy steps")}
          </p>
          
          {/* Customize your service section */}
          <div className="max-w-4xl mx-auto">

            
                                                    {/* Service Icons Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-36 justify-items-center">
                               {/* Home/Standard */}
                <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                                     <span className="text-sm font-semibold text-white text-center group-hover:text-blue-200 transition-colors">{t("howItWorks.customizeOptions.standard", "Standard")}</span>
                </div>

                                                               {/* Kitchen */}
                 <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                   <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-orange-200 transition-all duration-300">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                     </svg>
                   </div>
                                       <span className="text-sm font-semibold text-white text-center group-hover:text-orange-200 transition-colors">{t("howItWorks.customizeOptions.kitchen", "Kitchen")}</span>
                 </div>

                 {/* Bathroom */}
                 <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                   <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-cyan-200 transition-all duration-300">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                     </svg>
                   </div>
                                       <span className="text-sm font-semibold text-white text-center group-hover:text-cyan-200 transition-colors">{t("howItWorks.customizeOptions.bathroom", "Bathroom")}</span>
                 </div>

                 {/* Living Room */}
                 <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                   <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-green-200 transition-all duration-300">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                     </svg>
                   </div>
                                       <span className="text-sm font-semibold text-white text-center group-hover:text-green-200 transition-colors">{t("howItWorks.customizeOptions.livingRoom", "Living Room")}</span>
                 </div>

                 {/* Refrigerator */}
                 <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                   <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                     </svg>
                   </div>
                                       <span className="text-sm font-semibold text-white text-center group-hover:text-purple-200 transition-colors">{t("howItWorks.customizeOptions.refrigerator", "Refrigerator")}</span>
                 </div>

                 {/* Bedroom */}
                 <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                   <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-pink-200 transition-all duration-300">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                     </svg>
                   </div>
                                       <span className="text-sm font-semibold text-white text-center group-hover:text-pink-200 transition-colors">{t("howItWorks.customizeOptions.bedroom", "Bedroom")}</span>
                 </div>

                {/* Ask your pro */}
                <div className="flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-yellow-200 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                                     <span className="text-sm font-semibold text-white text-center group-hover:text-yellow-200 transition-colors">{t("howItWorks.customizeOptions.askProvider", "Ask your pro")}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Steps Timeline */}
        <div 
          ref={sectionRef}
          className="relative"
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-center space-x-12 lg:space-x-20">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                {/* Step Card */}
                <div className="step-card opacity-0 transform translate-y-8 transition-all duration-700 ease-out">
                  <div className="relative group cursor-pointer">
                    {/* Soft background shape */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300 ease-in-out scale-110 group-hover:scale-125"></div>
                    
                    {/* Main card */}
                    <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)] transition-all duration-300 ease-in-out p-8 text-center w-72 h-80 flex flex-col items-center justify-center border border-gray-100 hover:scale-105">
                      
                      {/* Emoji */}
                      <div className="text-5xl mb-6">
                        {step.emoji}
                      </div>

                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-[#00796B] to-[#00695C] text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {step.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>

                      {/* Caption */}
                      <p className="text-gray-600 leading-relaxed">
                        {step.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Curved Arrow Connector (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="mx-6 lg:mx-10 relative">
                    <div className="animate-pulse">
                      <svg 
                        width="60" 
                        height="40" 
                        viewBox="0 0 60 40" 
                        className="text-white"
                      >
                        <path 
                          d="M0 20 Q15 20 30 20 Q45 20 60 20" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path 
                          d="M50 15 L60 20 L50 25" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Card */}
                <div className="step-card opacity-0 transform translate-y-8 transition-all duration-700 ease-out">
                  <div className="relative group cursor-pointer">
                    {/* Soft background shape */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300 ease-in-out scale-110 group-hover:scale-125"></div>
                    
                    {/* Main card */}
                    <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)] transition-all duration-300 ease-in-out p-6 text-center w-full max-w-sm flex flex-col items-center justify-center border border-gray-100 hover:scale-105">
                      
                      {/* Emoji */}
                      <div className="text-4xl mb-4">
                        {step.emoji}
                      </div>

                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00796B] to-[#00695C] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {step.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>

                      {/* Caption */}
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {step.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Down Arrow Connector (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="my-6 animate-pulse">
                    <svg 
                      width="40" 
                      height="40" 
                      viewBox="0 0 40 40" 
                      className="text-white"
                    >
                      <path 
                        d="M20 0 Q20 10 20 20 Q20 30 20 40" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path 
                        d="M15 30 L20 40 L25 30" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <button 
            onClick={() => {
              window.location.href = "/quote#quote-form";
            }}
            className="w-full max-w-xs bg-white hover:bg-gray-100 text-[#2563EB] font-bold py-3 rounded-lg text-lg transition-all duration-200 mx-auto"
          >
            {t("howItWorks.cta", "Get Started Today")}
          </button>
        </div>
      </div>
    </section>
  );
} 