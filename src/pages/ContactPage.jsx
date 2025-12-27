import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, MessageCircle, User } from "lucide-react";
import BackButton from "../components/BackButton";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-24 pb-20 px-2">
      {/* Professional background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0, 168, 150, 0.1) 35px, rgba(0, 168, 150, 0.1) 70px)`,
        }}></div>
      </div>
      {/* BACK BUTTON: Sol üst köşede sabit */}
      <div className="absolute top-28 left-4 md:left-72 z-20">
        <BackButton />
      </div>

      {/* Sayfa içeriği */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight mb-14 text-primary drop-shadow-lg">
          {t("contactPage.headline")}
        </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm font-medium mb-16">
              <div className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center border border-gray-200/50 transition-all duration-300 hover:shadow-[0_0_20px_theme('colors.accent')] hover:scale-105">
                <div className="flex justify-center mb-3 text-accent">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10m-12 8V7a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">{t("contactPage.features.businessHours.title")}</h3>
                <p className="text-dark">{t("contactPage.features.businessHours.monFri")}</p>
                <p className="text-dark">{t("contactPage.features.businessHours.satSun")}</p>
              </div>
              <div className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center border border-gray-200/50 transition-all duration-300 hover:shadow-[0_0_20px_theme('colors.accent')] hover:scale-105">
                <div className="flex justify-center mb-3 text-accent">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">{t("contactPage.features.timeOff.title")}</h3>
                <p className="text-dark">{t("contactPage.features.timeOff.description")}</p>
              </div>
              <div className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center border border-gray-200/50 transition-all duration-300 hover:shadow-[0_0_20px_theme('colors.accent')] hover:scale-105">
                <div className="flex justify-center mb-3 text-accent">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-5 4v2m0 4h.01" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">{t("contactPage.features.securePayment.title")}</h3>
                <p className="text-dark">{t("contactPage.features.securePayment.description")}</p>
              </div>
              <div className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center border border-gray-200/50 transition-all duration-300 hover:shadow-[0_0_20px_theme('colors.accent')] hover:scale-105">
                <div className="flex justify-center mb-3 text-accent">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a5 5 0 00-10 0v2m10 0H7" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">{t("contactPage.features.alwaysInTouch.title")}</h3>
                <p className="text-dark">{t("contactPage.features.alwaysInTouch.description")}</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-gray-200/50 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8 text-dark flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">{t("contactPage.getInTouch")}</h3>
                  <div className="flex items-start gap-4 mb-4">
                    <MapPin className="w-7 h-7 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-lg text-dark">1137 Washington St, unit 101</p>
                      <p className="text-dark/80">Boston, MA 02124, United States</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <Phone className="w-7 h-7 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <a href="tel:6172021372" className="font-semibold text-lg text-dark hover:text-accent transition-colors">
                        (617) 202-1372
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <Mail className="w-7 h-7 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-lg text-dark">info@solvidaclean.com</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-primary mb-4">{t("contactPage.connectWithUs")}</h4>
                  <div className="flex gap-6 text-2xl">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-highlight transition-colors text-dark"><Facebook className="w-6 h-6" /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-highlight transition-colors text-dark"><Twitter className="w-6 h-6" /></a>
                    <a href="https://instagram.com/solvidaclean" target="_blank" rel="noopener noreferrer" className="hover:text-highlight transition-colors text-dark"><Instagram className="w-6 h-6" /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-highlight transition-colors text-dark"><Linkedin className="w-6 h-6" /></a>
                  </div>
                </div>
              </div>
              <div className="md:border-l md:border-gray-200/50 md:pl-10 flex flex-col justify-center">
                <h2 className="text-3xl font-semibold mb-3 text-center text-primary">{t("contact.title")}</h2>
                <p className="text-center text-lg mb-6 opacity-90 text-dark">{t("contact.introText")}</p>
                <form
                  action="https://formspree.io/f/YOUR_FORM_ID"
                  method="POST"
                  className="space-y-5"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-accent w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder={t("contact.namePlaceholder")}
                      className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-lg shadow-sm focus:ring-2 focus:ring-accent text-dark text-base transition"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-accent w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder={t("contact.emailPlaceholder")}
                      className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-lg shadow-sm focus:ring-2 focus:ring-accent text-dark text-base transition"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-4 text-accent w-5 h-5" />
                    <textarea
                      name="message"
                      placeholder={t("contact.messagePlaceholder")}
                      rows="5"
                      className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-lg shadow-sm focus:ring-2 focus:ring-accent text-dark text-base transition resize-none"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {t("contact.submitButton")}
                  </button>
                </form>
              </div>
            </div>
          </div> {/* <-- add this line to close the main content wrapper */}
        </section>
    );
}