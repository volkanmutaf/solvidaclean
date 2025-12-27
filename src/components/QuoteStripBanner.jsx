import { useTranslation } from "react-i18next";

export default function QuoteStripBanner() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-gradient-to-r from-primary to-dark text-white text-center text-sm sm:text-base md:text-lg py-3 px-2 sm:px-4 font-extrabold tracking-wide shadow-lg relative overflow-hidden">
      {/* Cleaner Woman Image - Fixed to banner bottom, moves with banner */}
      <div className="hidden lg:block absolute right-4 xl:right-8 bottom-0 z-10 pointer-events-none" style={{
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
      
      <span className="animate-strong-blink break-words inline-block px-2">
        {t("quoteBanner.guarantee")}
        <span className="font-black text-accent"> {t("quoteBanner.within")}</span> {t("quoteBanner.or")}
        <span className="text-accent font-black text-lg sm:text-xl"> {t("quoteBanner.discount")}</span>!
      </span>
    </div>
  );
}