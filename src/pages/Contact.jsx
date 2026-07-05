import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import FaqSection from '@/components/FaqSection';

const Contact = () => {
  const { t } = useTranslation();

  const contactInfoItems = [
    {
      icon: MapPin,
      title: t('contact.address'),
      details: [
        "Jl Buana Kubu No.47, Kel/Desa Tegal Harum, Kecamatan Denpasar Barat, Kota Denpasar, Provinsi Bali - 80119",
        "Indonesia"
      ]
    },
    {
      icon: Phone,
      title: t('contact.phoneTitle'),
      details: [
        "+62 853 5353 6667",
      ]
    },
    {
      icon: Mail,
      title: t('contact.emailTitle'),
      details: [
        "info@drhukum.com"
      ]
    },
    {
      icon: Clock,
      title: t('contact.operationalHours'),
      details: [
        <span key="1" dangerouslySetInnerHTML={{ __html: t('contact.opHoursDetails') }} />
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>DrHukum Indonesia | Legal Services & Strategic Counsel</title>
        <meta name="description" content="DrHukum Indonesia provides practical legal services and strategic counsel for individuals and businesses, focusing on clarity, protection, and long-term solutions." />
        <meta property="og:title" content="DrHukum Indonesia | Legal Services & Strategic Counsel" />
        <meta property="og:description" content="DrHukum Indonesia provides practical legal services and strategic counsel for individuals and businesses, focusing on clarity, protection, and long-term solutions." />
      </Helmet>

      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('contact.title').split(' ')[0]} <span className="gradient-text">{t('contact.title').split(' ')[1]}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('contact.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <ContactInfo items={contactInfoItems} />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('contact.mapTitle')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('contact.mapSubtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl h-[500px]"
            >
              <iframe 
                src="https://maps.google.com/maps?q=-8.6573596,115.2599104&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DrHukum Office Location"
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </section>

        <FaqSection />
      </div>
    </>
  );
};

export default Contact;