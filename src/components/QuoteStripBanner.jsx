import { useTranslation } from "react-i18next";

export default function QuoteStripBanner() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-gradient-to-r from-primary to-dark text-white text-center text-base md:text-lg py-3 px-4 font-extrabold tracking-wide shadow-lg relative">
      {/* Cleaner Woman Image - Fixed to strip banner top line */}
      <div style={{
        position: 'absolute',
        right: '330px',
        top: '0px',
        transform: 'translateY(-100%)',
        width: '450px',
        height: '450px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        <img
          src="/images/cleaner-woman2.png"
          alt="Professional cleaning staff member"
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
          draggable={false}
          onError={(e) => { 
            console.error('Image failed to load:', e.target.src);
            e.target.style.display = 'none'; 
          }}
        />
      </div>
      
      <span className="animate-strong-blink">
        {t("quoteBanner.guarantee")}
        <span className="font-black text-accent"> {t("quoteBanner.within")}</span> {t("quoteBanner.or")}
        <span className="text-accent font-black text-xl"> {t("quoteBanner.discount")}</span>!
      </span>
    </div>
  );
}