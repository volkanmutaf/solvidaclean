// src/components/ServicesOverview.jsx
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function ServicesOverview() {
  const { t } = useTranslation();
  const [popularServices, setPopularServices] = useState([]);
  const [bostonAreas, setBostonAreas] = useState([]);
  const [suburbs, setSuburbs] = useState([]);

  useEffect(() => {
    setPopularServices(t('servicesOverview.popularServices', { returnObjects: true }));
    setBostonAreas(t('servicesOverview.bostonAreas', { returnObjects: true }));
    setSuburbs(t('servicesOverview.suburbs', { returnObjects: true }));
  }, [t]);

  return (
    <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FBFBFC]">
      <div className="max-w-7xl mx-auto">
        
        {/* Popular Services - Top Row */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t('servicesOverview.popularServicesTitle')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {popularServices.map((service, index) => {
              const icons = [
                // Commercial Office Cleaning
                <svg key="office" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>,
                // Vacation Rental
                <svg key="vacation" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>,
                // Home Organization
                <svg key="organization" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>,
                // Post Renovation Cleaning
                <svg key="renovation" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>,
                // Green Eco Friendly Cleaning
                <svg key="eco" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>,
                // Airbnb Turnaround Cleaning
                <svg key="airbnb" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>,
                // Move In Out Cleaning
                <svg key="move" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>,
                // Deep Cleaning
                <svg key="deep" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>,
                // Regular Cleaning
                <svg key="regular" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>,
                // Window & Blind Cleaning
                <svg key="window" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ];
              
              return (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-emerald-500/40 hover:ring-2 hover:ring-emerald-500/30 transition-all duration-300 hover:scale-105 group relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                      {icons[index]}
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-emerald-600 transition-colors duration-300">{service}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Areas - Bottom Row */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Boston Service Areas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('servicesOverview.bostonServiceAreasTitle')}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {bostonAreas.map((area, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <span className="text-xs font-medium text-gray-700 group-hover:text-emerald-600 transition-colors duration-300">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suburbs */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('servicesOverview.suburbsTitle')}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {suburbs.map((suburb, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <span className="text-xs font-medium text-gray-700 group-hover:text-emerald-600 transition-colors duration-300">{suburb.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
