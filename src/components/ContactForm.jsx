import { useTranslation } from "react-i18next";
import { Mail, User, MessageCircle } from "lucide-react";

export function ContactForm() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#e0f7fa] via-[#f1f8e9] to-[#e3f2fd] min-h-[80vh] flex flex-col items-center justify-center" id="contact">
      <div className="max-w-xl w-full mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 border border-accent/10">
        <h2 className="text-4xl font-extrabold text-[#00BFA6] mb-2 text-center drop-shadow-lg">
          {t("contact.title")}
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center">
          {t("contact.introText")}
        </p>
        <form
          className="space-y-6"
          action="https://formspree.io/f/YOUR_FORM_ID"
          method="POST"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00BFA6] w-5 h-5" />
            <input
              type="text"
              name="name"
              placeholder={t("contact.namePlaceholder")}
              className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00BFA6] text-gray-800 text-base transition"
              required
              autoComplete="name"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00BFA6] w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder={t("contact.emailPlaceholder")}
              className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00BFA6] text-gray-800 text-base transition"
              required
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-4 text-[#00BFA6] w-5 h-5" />
            <textarea
              name="message"
              placeholder={t("contact.messagePlaceholder")}
              rows="5"
              className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00BFA6] text-gray-800 text-base transition resize-none"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00796B] to-[#00BFA6] hover:from-[#00BFA6] hover:to-[#00796B] text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
          >
            {t("contact.submitButton")}
          </button>
        </form>
      </div>
    </section>
  );
}