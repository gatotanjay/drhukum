import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, Hotel, UtensilsCrossed, Rocket, Factory, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Industries = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleConsultation = () => {
    window.scrollTo(0, 0);
    navigate('/kontak');
  };

  const industries = [
    {
      icon: Building2,
      key: 'realEstate',
    },
    {
      icon: Hotel,
      key: 'hospitality',
    },
    {
      icon: UtensilsCrossed,
      key: 'fnb',
    },
    {
      icon: Rocket,
      key: 'startup',
    },
    {
      icon: Factory,
      key: 'manufacturing',
    },
  ];

  return (
    <>
      <Helmet>
        <title>DrHukum Indonesia | {t('industries.title')}</title>
        <meta name="description" content={t('industries.subtitle')} />
        <meta property="og:title" content={`DrHukum Indonesia | ${t('industries.title')}`} />
        <meta property="og:description" content={t('industries.subtitle')} />
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
                {t('industries.title').split(' ')[0]}{' '}
                <span className="gradient-text">
                  {t('industries.title').substring(t('industries.title').indexOf(' ') + 1)}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('industries.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.key}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <industry.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t(`industries.list.${industry.key}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t(`industries.list.${industry.key}.desc`)}
                  </p>

                  <div className="space-y-2">
                    {t(`industries.list.${industry.key}.points`, { returnObjects: true }).map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('industries.ctaTitle')}
              </h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t('industries.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                  onClick={handleConsultation}
                >
                  {t('industries.cta')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Industries;
