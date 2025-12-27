// src/components/QuoteGuaranteeBanner.jsx

import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, Award } from 'lucide-react';

export function QuoteGuaranteeBanner() {
  const { t } = useTranslation();

  // Header'dan kopyalanan özel yumuşak kaydırma fonksiyonu
  const smoothScrollTo = (targetPosition, duration = 1200) => { // Header'daki süreyi (1200ms) kullandık
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing fonksiyonu
    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  // Banner'a tıklandığında #quotes-form ID'sine yönlendiren fonksiyon
  const scrollToQuotesForm = () => {
    const quotesFormSection = document.getElementById('quotes-form');
    // Sayfadaki fixed olan header elementini bulmaya çalış
    const header = document.querySelector('header'); // 'header' etiketine sahip ilk elementi seçer

    if (quotesFormSection) {
      // Header'ın yüksekliğini al, eğer header yoksa 0 varsay
      const headerHeight = header ? header.offsetHeight : 0;
      // Hedef elementin sayfanın üstüne göre pozisyonunu al
      const elementPosition = quotesFormSection.getBoundingClientRect().top;
      // Kaydırılması gereken nihai pozisyonu hesapla
      // Mevcut kaydırma pozisyonu + elementin viewport'a göre pozisyonu - header yüksekliği - ek boşluk (20px)
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 0; // Ek 20px boşluk için

      // Özel yumuşak kaydırma fonksiyonunu çağır
      smoothScrollTo(offsetPosition, 1200); // Header'daki süreyi kullandık
    }
  };

  return (
    // Tüm banner kapsayıcısını tıklanabilir yapıyoruz ve kursörü değiştiriyoruz
    // onClick ile yönlendirme fonksiyonunu çağırıyoruz
    <section
  className="w-full bg-gradient-to-r from-accent to-dark text-light py-0 px-4 sm:px-6 lg:px-12 cursor-pointer relative z-10"
  onClick={scrollToQuotesForm}
>


  <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">

    {/* LEFT: Main Headline */}
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-2 text-light">
        {t('banner.mainHeadline')}
      </h2>
      <p className="text-base sm:text-lg text-light opacity-80">
        {t('banner.subHeadline')}
      </p>
    </div>

    {/* RIGHT: 3 Highlights */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-4 md:mt-0">

      {/* Feature Block */}
      {[{
        icon: <Clock className="text-light w-6 h-6" />,
        title: t('banner.timeGuarantee'),
        subtitle: t('banner.hours'),
      }, {
        icon: <CheckCircle2 className="text-light w-6 h-6" />,
        title: t('banner.satisfactionGuarantee'),
        subtitle: t('banner.satisfactionText'),
      }, {
        icon: <Award className="text-light w-6 h-6" />,
        title: t('banner.qualityGuarantee'),
        subtitle: t('banner.qualityText'),
      }].map((item, i) => (
        <div key={i} className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
          <div className="bg-light/20 p-2 rounded-full backdrop-blur-md">
            {item.icon}
          </div>
          <div className="text-left px-3 py-1 rounded-lg backdrop-blur-md bg-white/10 relative overflow-hidden
                          group-hover:shadow-[0_0_12px_3px] group-hover:shadow-highlight/30 transition-shadow duration-300">
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 animate-pulse-once rounded-lg"></span>
            <p className="text-sm font-semibold text-light relative z-10">{item.title}</p>
            <p className="text-xs opacity-80 text-light relative z-10">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}