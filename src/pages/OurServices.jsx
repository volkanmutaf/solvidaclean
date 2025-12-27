// src/pages/OurServices.jsx

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import ScrollToTop from "../components/ScrollToTop";

const servicesByCategory = {
  specialties: [
    {
      key: "recurring",
      title: "Recurring Cleaning",
      description: "Regular scheduled cleaning services for consistent maintenance",
      icon: "🔄",
      image: "/images/recurring-cleaning.jpeg",
    },
    {
      key: "standard",
      title: "Standard Cleaning",
      description: "Comprehensive cleaning for everyday cleanliness",
      icon: "✨",
      image: "/images/standard-cleaning.png",
    },
    {
      key: "deep",
      title: "Deep Cleaning",
      description: "Thorough cleaning that reaches every corner and surface",
      icon: "🧼",
      image: "/images/deep-cleaning.jpg",
    },
    {
      key: "moveinout",
      title: "Move In/Out",
      description: "Complete cleaning for moving transitions",
      icon: "📦",
      image: "/images/move-in-out.png",
    },
    {
      key: "kitchen",
      title: "Kitchen Cleaning",
      description: "Specialized kitchen and appliance cleaning",
      icon: "🍳",
      image: "/images/kitchen-cleaning.jpg",
    },
    {
      key: "bathroom",
      title: "Bathroom Cleaning",
      description: "Detailed bathroom and fixture cleaning",
      icon: "🚿",
      image: "/images/bathroom-cleaning.jpg",
    },
    {
      key: "ecofriendly",
      title: "Eco-Friendly Cleaning",
      description: "Green cleaning services using environmentally safe products",
      icon: "🌿",
      image: "/images/eco-friendly-cleaning.png",
    },
    {
      key: "window",
      title: "Window Cleaning",
      description: "Professional window and glass surface cleaning",
      icon: "🪟",
      image: "/images/window-cleaning.jpg",
    },
    {
      key: "onetime",
      title: "One-Time Cleaning",
      description: "Single service cleaning for special occasions or immediate needs",
      icon: "🎯",
      image: "/images/one-time-cleaning.jpg",
    },
  ],
  residential: [
    {
      key: "airbnb",
      title: "Airbnb Cleaning",
      description: "Quick turnaround cleaning for rental properties",
      icon: "🏠",
      image: "/images/airbnb-cleaning.jpg",
    },
    {
      key: "apartment",
      title: "Apartment Cleaning",
      description: "Comprehensive cleaning for apartment units",
      icon: "🏢",
      image: "/images/apartment-cleaning.jpg",
    },
    {
      key: "studio",
      title: "Studio Cleaning",
      description: "Efficient cleaning for studio apartments",
      icon: "🎨",
      image: "/images/studio-cleaning.jpg",
    },
    {
      key: "spring",
      title: "Spring Cleaning",
      description: "Seasonal deep cleaning and organization",
      icon: "🌸",
      image: "/images/spring-cleaning.jpg",
    },
    {
      key: "postconstruction",
      title: "Post Construction Cleaning",
      description: "Cleanup after construction and renovation",
      icon: "🏗️",
      image: "/images/post-construction-cleaning.jpeg",
    },
    {
      key: "specialevent",
      title: "Special Event Cleaning",
      description: "Pre and post-event cleaning services",
      icon: "🎉",
      image: "/images/special-event-cleaning.webp",
    },
    {
      key: "homeoffice",
      title: "Home Office Cleaning",
      description: "Dedicated cleaning for home workspaces",
      icon: "💼",
      image: "/images/home-office-cleaning.jpeg",
    },
    {
      key: "condo",
      title: "Condo Cleaning",
      description: "Specialized cleaning for condominium units",
      icon: "🏘️",
      image: "/images/condo-cleaning.jpg",
    },
    {
      key: "vacation",
      title: "Vacation Rental Cleaning",
      description: "Professional cleaning for vacation properties",
      icon: "🏖️",
      image: "/images/vacation-rental-cleaning.jpg",
    },
  ],
  commercial: [
    {
      key: "routine",
      title: "Routine Cleaning",
      description: "Regular maintenance cleaning for businesses",
      icon: "📅",
      image: "/images/routine-cleaning.jpg",
    },
    {
      key: "office",
      title: "Office Cleaning",
      description: "Professional office space cleaning",
      icon: "🏢",
      image: "/images/office-cleaning.jpg",
    },
    {
      key: "financial",
      title: "Financial Institutions",
      description: "Specialized cleaning for banks and financial offices",
      icon: "💰",
      image: "/images/financial-institutions.png",
    },
    {
      key: "medical",
      title: "Medical Facilities",
      description: "Healthcare facility cleaning and sanitization",
      icon: "🏥",
      image: "/images/medical-facilities.jpg",
    },
    {
      key: "retail",
      title: "Retail Stores",
      description: "Retail space cleaning and maintenance",
      icon: "🛍️",
      image: "/images/retail-stores.webp",
    },
    {
      key: "technology",
      title: "Technology",
      description: "Tech company and data center cleaning",
      icon: "💻",
      image: "/images/technology-cleaning.jpg",
    },
    {
      key: "religious",
      title: "Religious",
      description: "Religious institution cleaning services",
      icon: "⛪",
      image: "/images/religious-cleaning.jpg",
    },
    {
      key: "warehouse",
      title: "Warehouse Cleaning",
      description: "Industrial warehouse and storage facility cleaning",
      icon: "🏭",
      image: "/images/warehouse-cleaning.jpg",
    },
    {
      key: "restaurant",
      title: "Restaurant Cleaning",
      description: "Professional kitchen and dining area cleaning",
      icon: "🍽️",
      image: "/images/restaurant-cleaning.jpg",
    },
  ],
  additional: [
    {
      key: "windowinterior",
      title: "Cleaning the interior of windows",
      description: "Detailed interior window cleaning service",
      icon: "🪟",
      image: "/images/window-interior-cleaning.jpg",
      additionalCharge: true,
    },
    {
      key: "linenchange",
      title: "Linen change and make beds",
      description: "Bed linens change and bed making service",
      icon: "🛏️",
      image: "/images/linen-change.jpg",
      additionalCharge: true,
    },
    {
      key: "refrigerator",
      title: "Deep clean inside refrigerator",
      description: "Thorough refrigerator interior cleaning",
      icon: "🧊",
      image: "/images/refrigerator-cleaning.jpg",
      additionalCharge: true,
    },
    {
      key: "oven",
      title: "Deep clean inside oven",
      description: "Comprehensive oven interior deep cleaning",
      icon: "🔥",
      image: "/images/oven-cleaning.jpg",
      additionalCharge: true,
    },
    {
      key: "selfcleaningoven",
      title: "Self-cleaning oven",
      description: "Self-cleaning oven service and maintenance",
      icon: "⚙️",
      image: "/images/self-cleaning-oven.jpg",
      additionalCharge: true,
    },
    {
      key: "laundry",
      title: "Loads of laundry",
      description: "Professional laundry washing and folding service",
      icon: "👕",
      image: "/images/laundry.jpg",
      additionalCharge: true,
    },
    {
      key: "dishes",
      title: "Dishes",
      description: "Dishwashing and kitchenware cleaning service",
      icon: "🍽️",
      image: "/images/dishes.jpg",
      additionalCharge: true,
    },
    {
      key: "disinfecting",
      title: "Disinfecting services",
      description: "Professional disinfection and sanitization",
      icon: "🦠",
      image: "/images/disinfecting-services.jpeg",
      additionalCharge: true,
    },
    {
      key: "garage",
      title: "Garage Cleaning",
      description: "Complete garage cleaning and organization service",
      icon: "🚗",
      image: "/images/garage-cleaning.jpg",
      additionalCharge: true,
    },
  ],
};

const tabs = [
  { id: "specialties", labelKey: "Our Specialties" },
  { id: "residential", labelKey: "Residential Cleaning" },
  { id: "commercial", labelKey: "Commercial Cleaning" },
  { id: "additional", labelKey: "Additional Services" },
];

export default function OurServices() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "specialties");

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ["specialties", "residential", "commercial", "additional"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <>
      <ScrollToTop />

      <section className="bg-solvidaBg pt-24 pb-20 min-h-screen w-full px-2">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            {t("services.title")}
          </h1>

          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-3 rounded-full font-medium text-sm shadow transition-all duration-300 border
                  ${
                    activeTab === tab.id
                      ? "bg-primary text-white border-primary hover:bg-highlight"
                      : "bg-white text-dark border-accent hover:bg-gray-100 hover:text-highlight"
                  }`}
              >
                {tab.labelKey}
              </button>
            ))}
          </div>

          {/* Additional Services Notice */}
          {activeTab === "additional" && (
            <div className="max-w-7xl mx-auto mb-6 px-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-yellow-800 font-semibold mb-2">⚠️ Additional Charges Apply</p>
                <p className="text-yellow-700 text-sm">
                  For these extra services, additional charges apply. Please contact us for pricing details.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {servicesByCategory[activeTab]?.map((service) => (
              <div
                key={service.key}
                className="h-full"
              >
                <ServiceCard
                  title={service.title}
                  icon={service.icon}
                  image={service.image}
                  description={service.description}
                  additionalCharge={service.additionalCharge}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
