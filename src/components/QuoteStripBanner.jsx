import { useTranslation } from "react-i18next";

export default function QuoteStripBanner() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-gradient-to-r from-primary to-dark text-white text-center text-sm sm:text-base md:text-lg py-3 px-2 sm:px-4 font-extrabold tracking-wide shadow-lg relative overflow-hidden" style={{ zIndex: 40 }}>
      <span className="animate-strong-blink break-words inline-block px-2">
        {t("quoteBanner.guarantee")}
        <span className="font-black text-accent"> {t("quoteBanner.within")}</span> {t("quoteBanner.or")}
        <span className="text-accent font-black text-lg sm:text-xl"> {t("quoteBanner.discount")}</span>!
      </span>
    </div>
  );
}