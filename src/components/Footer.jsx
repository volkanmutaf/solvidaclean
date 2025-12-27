// Footer.jsx
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Linkedin,
  Home,
  User,
  Building2,
  MessageCircle
} from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SolVida Clean",
      "description": t('footer.seo.structuredData.description'),
      "url": "https://solvidaclean.com",
      "logo": "https://solvidaclean.com/logo.png",
      "image": "https://solvidaclean.com/logo.png",
      "telephone": "+1-617-202-1372",
      "email": "info@solvidaclean.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Boston",
        "addressRegion": "MA",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "42.3601",
        "longitude": "-71.0589"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-617-202-1372",
        "contactType": "customer service",
        "areaServed": "Boston, MA",
        "availableLanguage": ["English", "Portuguese", "Spanish", "Turkish"]
      },
      "serviceArea": {
        "@type": "Place",
        "name": "Boston Metropolitan Area",
        "description": "Serving Boston and surrounding suburbs with professional cleaning services"
      },
      "sameAs": [
        "https://instagram.com/solvidaclean",
        "https://facebook.com/solvidaclean",
        "https://linkedin.com/company/solvidaclean"
      ],
      "openingHours": "Mo-Su 07:00-23:00",
      "priceRange": "$$",
      "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
      "currenciesAccepted": "USD"
    };

    // Add structured data to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [t]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleScrollOrNavigate = (id) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/service-areas") return location.pathname === "/service-areas";
    if (path === "/contact") return location.pathname === "/contact";
    if (path === "about") return location.hash === "#about";
    return location.pathname.includes(path);
  };

  return (
    <footer className="bg-gray-900 text-gray-100" role="contentinfo" aria-label="Site footer">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="SolVida Clean Logo" 
                className="h-10 w-auto object-contain filter brightness-0 invert"
                loading="lazy"
              />
              <span className="text-xl font-bold text-white">
                SolVida Clean
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.brandDescription')}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <nav className="lg:col-span-1" role="navigation" aria-label="Footer navigation">
            <h3 className="text-white font-semibold mb-4 text-lg">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigate("/")}
                  className={`block text-sm transition-colors duration-200 hover:text-primary ${
                    isActiveLink("/") ? "text-primary" : "text-gray-300"
                  }`}
                  aria-label={`Navigate to ${t('footer.home')} page`}
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" aria-hidden="true" />
                    {t('footer.home')}
                  </div>
                </button>
              </li>
              
              <li>
                <button
                  onClick={() => handleScrollOrNavigate("about")}
                  className={`block text-sm transition-colors duration-200 hover:text-primary ${
                    isActiveLink("about") ? "text-primary" : "text-gray-300"
                  }`}
                  aria-label={`Navigate to ${t('footer.about')} section`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" aria-hidden="true" />
                    {t('footer.about')}
                  </div>
                </button>
              </li>
              
              <li>
                <button
                  onClick={() => handleNavigate("/service-areas")}
                  className={`block text-sm transition-colors duration-200 hover:text-primary ${
                    isActiveLink("/service-areas") ? "text-primary" : "text-gray-300"
                  }`}
                  aria-label={`Navigate to ${t('footer.services')} page`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                    {t('footer.services')}
                  </div>
                </button>
              </li>
              
              <li>
                <button
                  onClick={() => handleNavigate("/contact")}
                  className={`block text-sm transition-colors duration-200 hover:text-primary ${
                    isActiveLink("/contact") ? "text-primary" : "text-gray-300"
                  }`}
                  aria-label={`Navigate to ${t('footer.contact')} page`}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    {t('footer.contact')}
                  </div>
                </button>
              </li>
            </ul>
          </nav>

          {/* Column 3: Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">{t('footer.contactInfo')}</h3>
            <address className="space-y-3 not-italic">
              <div className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors duration-200">
                <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                <a href="tel:+16172021372" className="text-sm hover:underline" aria-label="Call us at (617) 202-1372">
                  {t('footer.phone')}
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors duration-200">
                <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
                <a href="mailto:info@solvidaclean.com" className="text-sm hover:underline" aria-label="Send us an email at info@solvidaclean.com">
                  {t('footer.email')}
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors duration-200">
                <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm">{t('footer.location')}</span>
              </div>
            </address>
          </div>

          {/* Column 4: Social Media */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">{t('footer.followUs')}</h3>
            <div className="flex space-x-4" role="list" aria-label="Social media links">
              <a 
                href="https://instagram.com/solvidaclean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-[#00796B] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Instagram"
                role="listitem"
              >
                <Instagram className="w-5 h-5 text-gray-300 hover:text-white transition-colors duration-200" aria-hidden="true" />
              </a>
              
              <a 
                href="https://facebook.com/solvidaclean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-[#00796B] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Facebook"
                role="listitem"
              >
                <Facebook className="w-5 h-5 text-gray-300 hover:text-white transition-colors duration-200" aria-hidden="true" />
              </a>
              
              <a 
                href="https://linkedin.com/company/solvidaclean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-[#00796B] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Follow us on LinkedIn"
                role="listitem"
              >
                <Linkedin className="w-5 h-5 text-gray-300 hover:text-white transition-colors duration-200" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      
      {/* Legal & Sitemap Bar */}
      <div className="border-t border-gray-800 bg-gray-950/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500 text-center md:text-left">
            {t('footer.platformNotice')}
          </p>
          <nav className="flex gap-4 mt-2 md:mt-0" role="navigation" aria-label="Legal links">
            <button 
              onClick={() => navigate('/terms')} 
              className="text-xs text-gray-400 hover:text-accent hover:underline transition-all"
              aria-label={`Navigate to ${t('footer.terms')} page`}
            >
              {t('footer.terms')}
            </button>
            <button 
              onClick={() => navigate('/privacy')} 
              className="text-xs text-gray-400 hover:text-accent hover:underline transition-all"
              aria-label={`Navigate to ${t('footer.privacy')} page`}
            >
              {t('footer.privacy')}
            </button>
            <button 
              onClick={() => navigate('/sitemap')} 
              className="text-xs text-gray-400 hover:text-accent hover:underline transition-all"
              aria-label={`Navigate to ${t('footer.sitemap')} page`}
            >
              {t('footer.sitemap')}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}