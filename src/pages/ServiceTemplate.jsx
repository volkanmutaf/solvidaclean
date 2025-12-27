// src/pages/ServiceTemplate.jsx
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../components/BackButton";

export default function ServiceTemplate() {
  const { serviceKey } = useParams();
  const { t } = useTranslation();

  const content = t(`${serviceKey}.content`, { returnObjects: true });
  const title = t(`${serviceKey}.title`);
  const images = [
    `/services/${serviceKey}_1.jpg`,
    `/services/${serviceKey}_2.jpg`,
    `/services/${serviceKey}_main.jpg`,
  ];

  if (!Array.isArray(content)) {
    return (
      <p className="text-red-600 text-center mt-10">
        ⚠️ Missing translation content for "{serviceKey}"
      </p>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary">
        {title}
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <img
          src={images[0]}
          alt="Service illustration 1"
          className="w-full md:w-1/2 rounded shadow-md"
        />
        <p className="text-lg text-gray-700 md:w-1/2">{content[0]}</p>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center gap-6 mb-10">
        <p className="text-lg text-gray-700 md:w-1/2">{content[1]}</p>
        <img
          src={images[1]}
          alt="Service illustration 2"
          className="w-full md:w-1/2 rounded shadow-md"
        />
      </div>

      <div className="mb-10">
        <p className="text-lg text-gray-700">{content[2]}</p>
      </div>

      <div className="flex justify-center">
        <img
          src={images[2]}
          alt="Main service visual"
          className="w-full max-w-xl rounded shadow-md"
        />
      </div>

      <BackButton />
    </section>
  );
}
