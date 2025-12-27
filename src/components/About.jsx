import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="scroll-mt-24 py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#00796B]/10 px-8 py-4 rounded-full mb-6">
            <p className="text-lg font-medium text-primary">
              ✨ {t("about.missionTitle", "Our Mission")}
            </p>
          </div>
          <blockquote className="text-3xl md:text-4xl font-light text-gray-800 italic leading-relaxed max-w-4xl mx-auto">
            {t("about.missionStatement", "We don't just clean homes — we create peace of mind.")}
          </blockquote>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column - Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="/about/about_main.jpg"
                alt="Professional SolVida Clean team providing exceptional service"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00796B] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">⭐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">5-Star Rated</p>
                    <p className="text-sm text-gray-600">Trusted by 500+ families</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                {t("about.header", "Who We Are")}
              </h2>
              <div className="w-20 h-1 bg-[#00796B] rounded-full mb-8"></div>
            </div>

            {/* Key Points */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00796B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("about.excellenceTitle", "Years of Excellence")}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t("about.excellenceDesc", "With over a decade of dedicated service, we've built our reputation on reliability, attention to detail, and unwavering commitment to customer satisfaction.")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00796B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("about.ecoTitle", "Eco-Friendly & Safe")}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t("about.ecoDesc", "We use only non-toxic, eco-conscious cleaning products that are safe for your family, pets, and the environment while delivering exceptional results.")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00796B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xl">👥</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("about.teamTitle", "Professional Team")}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t("about.teamDesc", "Our fully trained, insured, and background-checked team treats every property as if it were their own, ensuring consistent quality and peace of mind.")}
                  </p>
                </div>
              </div>
            </div>

            {/* Values Badges */}
            <div className="pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t("about.valuesTitle", "Our Core Values")}</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white border border-[#00796B]/20 rounded-full px-4 py-2">
                  <span className="text-primary font-medium text-sm">{t("about.valueTrust", "Trust")}</span>
                </div>
                <div className="bg-white border border-[#00796B]/20 rounded-full px-4 py-2">
                  <span className="text-primary font-medium text-sm">{t("about.valuePunctuality", "Punctuality")}</span>
                </div>
                <div className="bg-white border border-[#00796B]/20 rounded-full px-4 py-2">
                  <span className="text-primary font-medium text-sm">{t("about.valueProfessionalism", "Professionalism")}</span>
                </div>
                <div className="bg-white border border-[#00796B]/20 rounded-full px-4 py-2">
                  <span className="text-primary font-medium text-sm">{t("about.valueQuality", "Quality")}</span>
                </div>
              </div>
            </div>

            {/* Multilingual Service */}
            <div className="bg-[#00796B]/5 rounded-xl p-6 border border-[#00796B]/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-primary text-xl">🌍</span>
                <h4 className="font-semibold text-gray-900">{t("about.multilingualTitle", "Multilingual Service")}</h4>
              </div>
              <p className="text-gray-700 text-sm">
                <span dangerouslySetInnerHTML={{ __html: t("about.multilingualDesc", "We proudly serve our diverse community in <b><i>English</i></b>, <b><i>Portuguese</i></b>, <b><i>Spanish</i></b>, and <b><i>Turkish</i></b> — ensuring clear communication and personalized service for everyone.") }} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
