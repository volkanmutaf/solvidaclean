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
      <Hero />
      <QuoteStripBanner />

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
