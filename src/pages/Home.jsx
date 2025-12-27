import { Hero } from "../components/Hero.jsx";
import { Services } from "../components/Services.jsx";
import { About } from "../components/About.jsx";
import { QuoteForm } from "../components/QuoteForm.jsx";
import { LogoMarquee } from "../components/LogoMarquee.jsx";
import { HowItWorks } from "../components/HowItWorks.jsx";
import QuoteStripBanner from "../components/QuoteStripBanner.jsx";
import CustomerReviews from "../components/CustomerReviews.jsx";
import ReasonsToLove from "../components/ReasonsToLove.jsx";
import Faq from "../components/Faq.jsx";
import ServicesOverview from "../components/ServicesOverview.jsx";


import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

useEffect(() => {
  const hash = location.hash?.substring(1);
  if (hash) {
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }
}, [location]);


  return (
    <>
      <div className="relative">
        <Hero />
        <QuoteStripBanner />
        {/* Cleaner Woman Image - Above blue background, aligned with banner top */}
        <div className="hidden lg:block absolute right-4 xl:right-8 pointer-events-none" style={{
          bottom: '100%',
          zIndex: 50,
          transform: 'translateY(0)',
        }}>
          <img
            src="/images/cleaner-woman2.png"
            alt="Professional cleaning staff member"
            className="w-auto h-auto max-w-xs xl:max-w-sm object-contain"
            style={{ marginBottom: 0, paddingBottom: 0 }}
            draggable={false}
            onError={(e) => { 
              console.error('Image failed to load:', e.target.src);
              e.target.style.display = 'none'; 
            }}
          />
        </div>
      </div>

      {/* Fiyat teklifi formu */}
      {/* <QuoteForm /> */}

      {/* Hizmetler listesi */}
      <Services />
      <CustomerReviews />
      <ReasonsToLove />
      {/* How It Works */}
      <HowItWorks />
      {/* Marka logoları kayan şerit */}
      <LogoMarquee />
      {/* Hakkımızda */}
      <About />
      <Faq />
      <ServicesOverview />
{/* Ana görsel alanı */}
    </>
  );
}
