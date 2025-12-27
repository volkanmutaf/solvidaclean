import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Phone, Home, Building2, Sparkles, Calendar, Truck, Hammer, MapPin, User, MessageCircle, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const languages = [
  { code: "en", label: "EN", flag: "https://flagcdn.com/16x12/us.png" },
  { code: "pt", label: "PT", flag: "https://flagcdn.com/16x12/br.png" },
  { code: "tr", label: "TR", flag: "https://flagcdn.com/16x12/tr.png" },
  { code: "es", label: "ES", flag: "https://flagcdn.com/16x12/es.png" }
];

const serviceIcons = {
  residential: <Home className="w-4 h-4" />,
  office: <Building2 className="w-4 h-4" />,
  deepclean: <Sparkles className="w-4 h-4" />,
  airbnb: <Calendar className="w-4 h-4" />,
  moveout: <Truck className="w-4 h-4" />,
  postconst: <Hammer className="w-4 h-4" />
};

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [lang, setLang] = useState(i18n.language || "en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false); // Mobile language dropdown

  // Refs for dropdown hover handling
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return;

      const scrollToElement = () => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          requestAnimationFrame(scrollToElement);
        }
      };

      scrollToElement();
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigate = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleScrollOrNavigate = (id) => {
    setMobileOpen(false);
    setDropdownOpen(false);

    const smoothScrollTo = (targetPosition, duration = 1000) => {
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

      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    };

    if (location.pathname === "/") {
      const element = document.getElementById(id);
      const header = document.querySelector("header");
      if (element) {
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 0;
        smoothScrollTo(offsetPosition, 1200);
      }
      window.history.replaceState(null, null, `#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/service-areas") return location.pathname === "/service-areas";
    if (path === "/contact") return location.pathname === "/contact";
    if (path === "about") return location.hash === "#about";
    if (path === "quotes-form") return location.hash === "#quotes-form";
    if (path === "/our-services") return location.pathname === "/our-services";
    return location.pathname.includes(path);
  };

  // Dropdown hover handlers with delay
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // 150ms delay before closing
  };

  return (
    // Tek bir ana kapsayıcı div
    <div className="bg-transparent">
      {/* Reverted header background to bg-light and text colors to text-dark */}
      <header className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-full relative px-2 sm:px-4">
          {/* Sol: Logo */}
          <div className="ml-0 sm:ml-[-60px] md:ml-[-80px] lg:ml-[-110px] flex-shrink-0 flex items-center h-full overflow-visible" style={{width: 'auto', height: '80px', minWidth: '100px'}}>
            <a onClick={() => handleNavigate("/")} className="cursor-pointer flex items-center justify-center w-full h-full touch-manipulation">
              <img src="/logo.png" alt="SolVida Clean Logo" className="h-20 sm:h-28 md:h-36 lg:h-44 object-contain transition-transform group-hover:scale-110 drop-shadow-2xl" />
            </a>
          </div>
                        {/* Phone Number - Mobile'da da göster */}
                        <div className="whitespace-nowrap flex items-center gap-1 sm:gap-2 text-accent font-semibold text-xs sm:text-sm md:text-lg">
  <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-accent flex-shrink-0" />
  <a href="tel:6172021372" className="text-accent font-bold text-xs sm:text-sm md:text-xl touch-manipulation">(617) 202-1372</a>
</div>
          {/* Sağ: Menü ve Butonlar */}
          <div className="flex-1 flex items-center justify-end h-full">
            {/* Changed text-light back to text-dark */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-nowrap whitespace-nowrap text-xs md:text-sm lg:text-base font-bold text-dark h-full">
              {/* Services Dropdown */}
              <div
                ref={dropdownRef}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                className="relative group"
              >
                <button
                  onClick={() => handleNavigate("/our-services")}
                  className={`group flex items-center gap-1 px-1 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap border-b-2 ${
                    location.pathname === "/our-services" || dropdownOpen
                      ? "text-highlight border-highlight"
                      : "text-dark border-transparent hover:text-highlight hover:border-highlight" // Changed text-light back to text-dark
                  }`}
                >
                  <Sparkles
                    className={`w-4 h-4 mr-1 transition-colors duration-200 ${
                      location.pathname === "/our-services" || dropdownOpen
                        ? "text-highlight"
                        : "text-gray-400 group-hover:text-highlight" // Reverted to text-gray-400
                    }`}
                  />
                  {t("services.title")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180 text-highlight" : "text-gray-400 group-hover:text-highlight" // Reverted to text-gray-400
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-300 ease-in-out ${
                    dropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="p-2">
                    <button
                      onClick={() => handleNavigate(`/our-services?tab=specialties`)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 hover:text-highlight rounded-md transition-colors duration-200 text-sm font-normal group"
                    >
                      <span className="text-gray-400 group-hover:text-highlight transition-colors">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <span className="font-medium">Our Specialties</span>
                    </button>
                    <button
                      onClick={() => handleNavigate(`/our-services?tab=residential`)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 hover:text-highlight rounded-md transition-colors duration-200 text-sm font-normal group"
                    >
                      <span className="text-gray-400 group-hover:text-highlight transition-colors">
                        <Home className="w-5 h-5" />
                      </span>
                      <span className="font-medium">Residential Cleaning</span>
                    </button>
                    <button
                      onClick={() => handleNavigate(`/our-services?tab=commercial`)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 hover:text-highlight rounded-md transition-colors duration-200 text-sm font-normal group"
                    >
                      <span className="text-gray-400 group-hover:text-highlight transition-colors">
                        <Building2 className="w-5 h-5" />
                      </span>
                      <span className="font-medium">Commercial Cleaning</span>
                    </button>
                    <button
                      onClick={() => handleNavigate(`/our-services?tab=additional`)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 hover:text-highlight rounded-md transition-colors duration-200 text-sm font-normal group"
                    >
                      <span className="text-gray-400 group-hover:text-highlight transition-colors">
                        <Plus className="w-5 h-5" />
                      </span>
                      <span className="font-medium">Additional Services</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <button
                onClick={() => handleNavigate("/service-areas")}
                className={`group flex items-center gap-1 px-1 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap border-b-2 ${
                  location.pathname === "/service-areas"
                    ? "text-highlight border-highlight"
                    : "text-dark border-transparent hover:text-highlight hover:border-highlight" // Changed text-light back to text-dark
                }`}
              >
                <MapPin
                  className={`w-4 h-4 transition-colors duration-200 ${
                    location.pathname === "/service-areas"
                      ? "text-highlight"
                      : "text-gray-400 group-hover:text-highlight" // Reverted to text-gray-400
                  }`}
                />
                {t("header.serviceAreas")}
              </button>

              {/* About */}
              <button
                onClick={() => handleScrollOrNavigate("about")}
                className={`group flex items-center gap-2 px-1 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap border-b-2 ${
                  isActiveLink("about")
                    ? "text-highlight border-highlight"
                    : "text-dark border-transparent hover:text-highlight hover:border-highlight" // Changed text-light back to text-dark
                }`}
              >
                <User className={`w-4 h-4 transition-colors duration-200 ${isActiveLink("about") ? "text-highlight" : "text-gray-400 group-hover:text-highlight"}`} /> {/* Reverted to text-gray-400 */}
                {t("about.title")}
              </button>

              {/* Contact */}
              <button
                onClick={() => handleNavigate("/contact")}
                className={`group flex items-center gap-2 px-1 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap border-b-2 ${
                  isActiveLink("/contact")
                    ? "text-highlight border-highlight"
                    : "text-dark border-transparent hover:text-highlight hover:border-highlight" // Changed text-light back to text-dark
                }`}
              >
                <MessageCircle className={`w-4 h-4 transition-colors duration-200 ${isActiveLink("/contact") ? "text-highlight" : "text-gray-400 group-hover:text-highlight"}`} /> {/* Reverted to text-gray-400 */}
                {t("contact.title")}
              </button>
            </nav>


            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">

              {/* Get Quote Button */}
              <Link
                to="/quote#quote-form"
                className="flex items-center gap-2 ml-6 bg-primary hover:bg-highlight text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span className="whitespace-nowrap">{t("quoteForm.title")}</span>
              </Link>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLanguageOpen((prev) => !prev)}
                  // Hover:bg-highlight remains as requested
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-light hover:bg-highlight text-dark rounded-lg transition-colors duration-200"
                >
                  <img
                    src={languages.find((l) => l.code === lang)?.flag}
                    alt={lang}
                    className="w-4 h-3"
                  />
                  <span className="font-medium">{languages.find((l) => l.code === lang)?.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${languageOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-32 bg-light rounded-lg shadow-lg border border-gray-100 transition-all duration-300 ease-in-out ${
                    languageOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  onMouseLeave={() => setLanguageOpen(false)} // Menüyü boş alana çekince kapatma
                >
                  {languages.map((lng) => (
                    <button
                      key={lng.code}
                      onClick={() => {
                        setLang(lng.code);
                        setLanguageOpen(false);
                      }}
                      // Dil seçenekleri üzerine gelince belirgin renk (accent/10 ve highlight metin rengi)
                      className="w-full px-4 py-2 text-left hover:bg-dark hover:text-white flex items-center gap-2 transition-colors duration-200"
                      >
                      <img src={lng.flag} alt={lng.code} className="w-4 h-3" />
                      {lng.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-1 sm:gap-2">
              {/* Mobile Language Toggle */}
              <button 
                onClick={() => setLangOpen((prev) => !prev)} 
                // Hover:bg-highlight remains as requested
                className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-light hover:bg-highlight text-dark rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <img src={languages.find((l) => l.code === lang)?.flag} alt={lang} className="w-4 h-3" />
                <span className="font-medium hidden sm:inline">{languages.find((l) => l.code === lang)?.label}</span>
              </button>

              <button 
                onClick={() => setMobileOpen((prev) => !prev)} 
                className="p-2 text-dark hover:bg-accent rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Language Dropdown */}
      {langOpen && (
        <div className="lg:hidden fixed top-[80px] right-4 w-40 bg-light rounded-lg shadow-lg border border-gray-100 z-40">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setLangOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-accent/10 hover:text-highlight flex items-center gap-2 transition-colors duration-200"
            >
              <img src={l.flag} alt={l.code} className="w-4 h-3" />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 right-0 w-full sm:w-80 max-w-sm h-full bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-dark hover:text-dark hover:bg-accent rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {/* Services Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-dark uppercase tracking-wide mb-3">
                    {t("services.title")}
                  </h4>
                  <div className="space-y-1">
                    {["residential", "office", "deepclean", "airbnb", "moveout", "postconst"].map((key) => (
                      <button
                        key={key}
                        onClick={() => handleNavigate(`/service/${key}`)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 active:bg-accent/20 hover:text-highlight rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px]"
                      >
                        <span className="text-gray-400">
                          {serviceIcons[key]}
                        </span>
                        <span className="font-medium text-base">{t(`${key}.title`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Navigation Items */}
                <div className="space-y-1">
                  <button 
                    onClick={() => handleNavigate("/service-areas")} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 active:bg-accent/20 hover:text-highlight rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px]"
                  >
                    <MapPin className={`w-5 h-5 transition-colors duration-200 ${isActiveLink("/service-areas") ? "text-highlight" : "text-gray-400 group-hover:text-highlight"}`} />
                    <span className="font-medium text-base">{t("header.serviceAreas")}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleScrollOrNavigate("about")} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 active:bg-accent/20 hover:text-highlight rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px]"
                  >
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-base">{t("about.title")}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigate("/contact")} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-dark hover:bg-accent/10 active:bg-accent/20 hover:text-highlight rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px]"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-base">{t("contact.title")}</span>
                  </button>
                </div>

                {/* Mobile Get Quote Button */}
                <div className="pt-4 sm:pt-6">
                  <button
                    onClick={() => handleScrollOrNavigate("quotes-form")}
                    className="flex items-center justify-center gap-2 w-full bg-[#00BFA6] hover:bg-[#00A896] active:bg-[#009688] text-white px-6 py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                  >
                    <FileText className="w-5 h-5" />
                    {t("quoteForm.title")}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div> // Bu, Header bileşeninin return ettiği tek ana div'dir.
  );
}