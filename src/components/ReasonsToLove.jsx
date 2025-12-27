// src/components/ReasonsToLove.jsx
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Star, Clock, Heart } from "lucide-react";

export default function ReasonsToLove() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const reasons = [
    {
      icon: Shield,
      titleKey: "reasonsToLove.trustedCleaners.title",
      descriptionKey: "reasonsToLove.trustedCleaners.description",
      gradient: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100"
    },
    {
      icon: Star,
      titleKey: "reasonsToLove.customerRecommended.title",
      descriptionKey: "reasonsToLove.customerRecommended.description",
      gradient: "from-yellow-500 to-orange-500",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100"
    },
    {
      icon: Heart,
      titleKey: "reasonsToLove.trustAndSafety.title",
      descriptionKey: "reasonsToLove.trustAndSafety.description",
      gradient: "from-red-500 to-pink-500",
      iconColor: "text-red-600",
      iconBg: "bg-red-100"
    },
    {
      icon: Clock,
      titleKey: "reasonsToLove.easyStart.title",
      descriptionKey: "reasonsToLove.easyStart.description",
      gradient: "from-green-500 to-emerald-500",
      iconColor: "text-green-600",
      iconBg: "bg-green-100"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold text-lg">
              {t("reasonsToLove.title")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("reasonsToLove.headline")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("reasonsToLove.subtitle")}
          </p>
        </div>

        {/* Reasons Grid - Icon with Description Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <div
                key={index}
                className="group text-center transition-all duration-500 hover:scale-105"
              >
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-20 h-20 ${reason.iconBg} ${reason.iconColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                  <IconComponent className="w-10 h-10" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {t(reason.titleKey)}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t(reason.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 border border-primary/10 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("reasonsToLove.cta.title")}
              </h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {t("reasonsToLove.cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate("/quote")}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  {t("reasonsToLove.cta.getQuote")}
                </button>
                <button 
                  onClick={() => navigate("/our-services")}
                  className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  {t("reasonsToLove.cta.exploreServices")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
