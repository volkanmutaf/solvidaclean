import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const services = [
  {
    key: "residential",
    image: "/services/residentialcleaning.jpg",
    icon: "🏠",
    path: "/service/residential",
  },
  {
    key: "office",
    image: "/services/officecleaning.jpg",
    icon: "🧹",
    path: "/service/office",
  },
  {
    key: "deep",
    image: "/services/deepcleaning.jpg",
    icon: "🧼",
    path: "/service/deepclean",
  },
  {
    key: "airbnb",
    image: "/services/airbnb_main.jpg",
    icon: "🛏️",
    path: "/service/airbnb",
  },
  {
    key: "postconst",
    image: "/services/postconstruction.jpg",
    icon: "🪣",
    path: "/service/postconst",
  },
  {
    key: "moveout",
    image: "/services/moveout.jpg",
    icon: "📦",
    path: "/service/moveout",
  },
];

export function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
<section id="services" className="py-16 px-6 bg-[#FBFBFC]">
  <div className="text-center mb-12">
    <Link
      to="/our-services"
      className="inline-block px-6 py-3 bg-[#00A896] text-white text-lg font-semibold rounded-full shadow-md hover:bg-[#63bba9] transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      {t("services.title")}
    </Link>
  </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((s, index) => (
          <div
            key={s.key}
            onClick={() => handleClick(s.path)}
            className="cursor-pointer bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition hover:shadow-[0_0_15px_rgba(0,121,107,0.4)] hover:scale-[1.02]"
          >
            <img
              src={s.image}
              alt={t(`services.items.${index}`)}
              className="w-full h-[180px] object-cover"
            />
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {t(`services.items.${index}`)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(`services.descs.${s.key}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}
