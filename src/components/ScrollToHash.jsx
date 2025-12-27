import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;
    if (hash) {
      const id = hash.substring(1); // "#quote" -> "quote"
      const element = document.getElementById(id);

      if (element) {
        // Elementi bulduk, hemen kaydır
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Element henüz DOM'da olmayabilir (örneğin async yüklenen içerik)
        // Kısa bir gecikmeyle tekrar dene
        const retryScroll = setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // 100ms gecikme ile tekrar dene

        return () => clearTimeout(retryScroll); // Temizleme fonksiyonu
      }
    }
  }, [location]); // location değiştiğinde tekrar çalış

  return null; // Bu bileşen UI'da bir şey render etmez
}