import React from "react";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-[#f9fafb] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">{t('terms.title', 'Terms of Service')}</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.intro', 'Introduction')}</h2>
          <p className="text-gray-700">{t('terms.introText', 'Welcome to SolVida Cleaning Service. By using our platform, you agree to these terms and conditions. Please read them carefully.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.user', 'User Responsibilities')}</h2>
          <p className="text-gray-700">{t('terms.userText', 'Users must provide accurate information and comply with all applicable laws. Misuse of the platform may result in account suspension.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.provider', 'Service Provider Responsibilities')}</h2>
          <p className="text-gray-700">{t('terms.providerText', 'Service providers must deliver services professionally and adhere to all platform guidelines and legal requirements.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.payments', 'Payments')}</h2>
          <p className="text-gray-700">{t('terms.paymentsText', 'All payments are processed securely through our platform. Users agree to pay for services as described at the time of booking.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.cancellations', 'Cancellations')}</h2>
          <p className="text-gray-700">{t('terms.cancellationsText', 'Cancellations must be made at least 24 hours in advance to avoid fees. Same-day cancellations may incur charges.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.disclaimers', 'Disclaimers')}</h2>
          <p className="text-gray-700">{t('terms.disclaimersText', 'SolVida Cleaning Service is a platform connecting users with independent cleaning professionals. We do not directly employ service providers and are not liable for their actions.')}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('terms.changes', 'Changes to Terms')}</h2>
          <p className="text-gray-700">{t('terms.changesText', 'We may update these terms at any time. Continued use of the platform constitutes acceptance of the new terms.')}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('terms.contact', 'Contact')}</h2>
          <p className="text-gray-700">{t('terms.contactText', 'If you have any questions about these terms, please contact us at info@solvidaclean.com.')}</p>
        </section>
      </div>
    </main>
  );
} 