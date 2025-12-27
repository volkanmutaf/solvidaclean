import React from "react";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-[#f9fafb] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">{t('privacy.title', 'Privacy Policy')}</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.intro', 'Introduction')}</h2>
          <p className="text-gray-700">{t('privacy.introText', 'This Privacy Policy explains how SolVida Cleaning Service collects, uses, and protects your information when you use our platform.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.collection', 'Information Collection')}</h2>
          <p className="text-gray-700">{t('privacy.collectionText', 'We collect information you provide directly, such as your name, contact details, and service preferences, as well as data collected automatically through cookies and analytics tools.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.use', 'Use of Information')}</h2>
          <p className="text-gray-700">{t('privacy.useText', 'Your information is used to provide and improve our services, process payments, communicate with you, and comply with legal obligations.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.sharing', 'Sharing of Information')}</h2>
          <p className="text-gray-700">{t('privacy.sharingText', 'We may share your information with service providers, partners, or as required by law. We do not sell your personal information to third parties.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.security', 'Security')}</h2>
          <p className="text-gray-700">{t('privacy.securityText', 'We implement reasonable security measures to protect your data, but cannot guarantee absolute security.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.cookies', 'Cookies')}</h2>
          <p className="text-gray-700">{t('privacy.cookiesText', 'Our platform uses cookies to enhance your experience. You can control cookie preferences in your browser settings.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.rights', 'User Rights')}</h2>
          <p className="text-gray-700">{t('privacy.rightsText', 'You have the right to access, update, or delete your personal information. Contact us to exercise these rights.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('privacy.changes', 'Changes to Policy')}</h2>
          <p className="text-gray-700">{t('privacy.changesText', 'We may update this policy from time to time. Continued use of the platform constitutes acceptance of the new policy.')}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('privacy.contact', 'Contact')}</h2>
          <p className="text-gray-700">{t('privacy.contactText', 'If you have any questions about this policy, please contact us at info@solvidaclean.com.')}</p>
        </section>
      </div>
    </main>
  );
} 