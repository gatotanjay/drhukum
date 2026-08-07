import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Users, Building, Heart, Home, Briefcase, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConsultation = () => {
    // Scroll to top and navigate to the Contact Us page
    window.scrollTo(0, 0);
    navigate('/kontak');
  };

  const services = [
    {
      icon: Scale,
      title: t('services.services.general.title'),
      description: t('services.services.general.desc'),
      features: t('services.services.general.features', { returnObjects: true }),
    },
    {
      icon: Users,
      title: t('services.services.visaImmigration.title'),
      description: t('services.services.visaImmigration.desc'),
      features: t('services.services.visaImmigration.features', { returnObjects: true }),
    },
    {
      icon: FileText,
      title: t('services.services.taxAccounting.title'),
      description: t('services.services.taxAccounting.desc'),
      features: t('services.services.taxAccounting.features', { returnObjects: true }),
    },
    {
      icon: Shield,
      title: t('services.services.permit.title'),
      description: t('services.services.permit.desc'),
      features: t('services.services.permit.features', { returnObjects: true }),
    },
    {
      icon: Briefcase,
      title: t('services.services.retainerLawyer.title'),
      description: t('services.services.retainerLawyer.desc'),
      features: t('services.services.retainerLawyer.features', { returnObjects: true }),
    },
  ];

  const processSteps = [
    { step: "01", title: t('services.processSteps.step1'), description: t('services.processSteps.step1Desc') },
    { step: "02", title: t('services.processSteps.step2'), description: t('services.processSteps.step2Desc') },
    { step: "03", title: t('services.processSteps.step3'), description: t('services.processSteps.step3Desc') },
    { step: "04", title: t('services.processSteps.step4'), description: t('services.processSteps.step4Desc') },
    { step: "05", title: t('services.processSteps.step5'), description: t('services.processSteps.step5Desc') }
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
                {t('services.title').split(' ')[0]} <span className="gradient-text">{t('services.title').substring(t('services.title').indexOf(' ') + 1)}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('services.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {Array.isArray(service.features) && service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('services.ourProcess')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('services.processSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {t('services.whyChoose')}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('services.reasons.team')}</h3>
                      <p className="text-gray-600">{t('services.reasons.teamDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('services.reasons.transparency')}</h3>
                      <p className="text-gray-600">{t('services.reasons.transparencyDesc')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('services.ctaTitle')}
              </h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t('services.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleConsultation}
                >
                  {t('services.freeConsultation')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;