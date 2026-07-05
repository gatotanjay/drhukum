import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { AtSign, Facebook, Instagram, MessageCircle, Phone, Youtube } from 'lucide-react';

const ContactInfo = ({ items }) => {
  const { t } = useTranslation();

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/drhukumofficial/',
    },
    {
      name: 'Threads',
      icon: AtSign,
      href: 'https://www.threads.net/@drhukumindonesia',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://www.facebook.com/drhukumindonesia',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://www.youtube.com/@drhukumindonesia',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.contactInfo')}</h2>
        <p className="text-gray-600 mb-8">{t('contact.contactInfoSubtitle')}</p>
      </div>
      <div className="space-y-6">
        {items.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <info.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-gray-600">{detail}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('contact.socialMedia')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
            >
              <social.icon className="h-5 w-5" />
              {social.name}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('contact.directContact')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <a href="http://wa.me/6281252525966" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="tel:+6281252525966">
              <Phone className="mr-2 h-4 w-4" />
              {t('contact.phoneTitle')}
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;