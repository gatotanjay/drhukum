import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const teamPhotos = [
  '/team1.png',
  '/team2.png',
  '/team3.png',
  '/team4.png',
  '/team5.png',
  '/team6.png',
];

const Team = () => {
  const { t } = useTranslation();
  const members = t('team.members', { returnObjects: true });

  return (
    <>
      <Helmet>
        <title>Our Team | DrHukum Indonesia</title>
        <meta name="description" content="Meet the DrHukum Indonesia team providing legal services and strategic counsel for individuals and businesses." />
        <meta property="og:title" content="Our Team | DrHukum Indonesia" />
        <meta property="og:description" content="Meet the DrHukum Indonesia team providing legal services and strategic counsel for individuals and businesses." />
      </Helmet>

      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('team.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('team.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.isArray(members) && members.map((member, index) => (
                <motion.article
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                    <img
                      src={teamPhotos[index % teamPhotos.length]}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h2>
                    <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{member.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Team;
