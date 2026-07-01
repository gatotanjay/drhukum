import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Users, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleConsultation = () => {
    window.scrollTo(0, 0);
    navigate('/kontak');
  };

  const services = [
    {
      title: t('footer.civilLaw'),
      description: t('services.services.civil.desc'),
      icon: Shield
    },
    {
      title: t('footer.criminalLaw'),
      description: t('services.services.criminal.desc'),
      icon: Users
    },
    {
      title: t('footer.businessLaw'),
      description: t('services.services.business.desc'),
      icon: Award
    }
  ];

  const advantages = [
    {
      title: t('home.advantages.experience'),
      description: t('home.advantages.experienceDesc'),
      icon: Clock
    },
    {
      title: t('home.advantages.consultation'),
      description: t('home.advantages.consultationDesc'),
      icon: Users
    },
    {
      title: t('home.advantages.successRate'),
      description: t('home.advantages.successRateDesc'),
      icon: Award
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

      <div className="pt-20">
        <section className="relative min-h-screen flex items-center justify-center hero-pattern overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-800 leading-tight">
                {t('home.heroTitle1')}
                <span className="block gradient-text">{t('home.heroTitle2')}</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl">{t('home.heroTitle3')}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto">
                {t('home.heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4"
                  onClick={handleConsultation}
                >
                  {t('home.bookConsultation')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/layanan">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    {t('home.ourServices')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/50 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-200/50 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                {t('home.mainServicesTitle')}
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                {t('home.mainServicesSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-secondary p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="bg-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800 mb-4">{service.title}</h2>
                  <p className="text-stone-600 mb-6">{service.description}</p>
                  <Link to="/layanan" className="text-primary font-semibold flex items-center hover:text-primary/90">
                    {t('home.learnMore')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                {t('home.whyChooseUsTitle')}
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                {t('home.whyChooseUsSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center group"
                >
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <advantage.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800 mb-4">{advantage.title}</h2>
                  <p className="text-stone-600">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-[#A87A50] to-[#C39B75] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t('home.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
                  onClick={handleConsultation}
                >
                  {t('home.startFreeConsultation')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;