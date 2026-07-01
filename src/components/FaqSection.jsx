import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FaqItem = ({ title, answer, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{answer}</p>
  </motion.div>
);

const FaqSection = () => {
  const { t } = useTranslation();

  const faqs = [
    { title: t('contact.faq1Title'), answer: t('contact.faq1Answer') },
    { title: t('contact.faq2Title'), answer: t('contact.faq2Answer') },
    { title: t('contact.faq3Title'), answer: t('contact.faq3Answer') },
    { title: t('contact.faq4Title'), answer: t('contact.faq4Answer') },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('contact.faqTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('contact.faqSubtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <FaqItem key={index} title={faq.title} answer={faq.answer} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;