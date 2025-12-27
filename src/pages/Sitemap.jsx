import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Sitemap() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-[#f9fafb] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">{t('sitemap.title', 'Sitemap')}</h1>
        <ul className="space-y-3 text-lg">
          <li><Link to="/" className="text-accent hover:underline">{t('sitemap.home', 'Home')}</Link></li>
          <li><Link to="/#about" className="text-accent hover:underline">{t('sitemap.about', 'About')}</Link></li>
          <li><Link to="/our-services" className="text-accent hover:underline">{t('sitemap.services', 'Our Services')}</Link></li>
          <li><Link to="/service-areas" className="text-accent hover:underline">{t('sitemap.serviceAreas', 'Service Areas')}</Link></li>
          <li><Link to="/contact" className="text-accent hover:underline">{t('sitemap.contact', 'Contact')}</Link></li>
          <li><Link to="/faq" className="text-accent hover:underline">{t('sitemap.faq', 'FAQ')}</Link></li>
          <li><Link to="/terms" className="text-accent hover:underline">{t('sitemap.terms', 'Terms of Service')}</Link></li>
          <li><Link to="/privacy" className="text-accent hover:underline">{t('sitemap.privacy', 'Privacy Policy')}</Link></li>
        </ul>
      </div>
    </main>
  );
} 