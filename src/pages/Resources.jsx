import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Scale,
  Download,
  Calendar,
  User,
  ChevronRight,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blog');

  const handleUnimplemented = () => {
    toast({
      title: "!!"
    });
  };

  const handleConsultation = () => {
    window.scrollTo(0, 0);
    navigate('/kontak');
  };

  const tabs = [
    { id: 'blog', label: t('resources.tabs.blog'), icon: BookOpen },
    { id: 'legalUpdates', label: t('resources.tabs.legalUpdates'), icon: Scale },
    { id: 'freeGuides', label: t('resources.tabs.freeGuides'), icon: Download }
  ];

  const blogPosts = t('resources.blog.posts', { returnObjects: true }) || [];
  const legalUpdateItems = t('resources.legalUpdates.items', { returnObjects: true }) || [];
  const guideItems = t('resources.freeGuides.guides', { returnObjects: true }) || [];

  return (
    <>
      <Helmet>
        <title>{t('resources.title')} - DrHukum</title>
        <meta name="description" content={t('resources.subtitle')} />
        <meta property="og:title" content={`${t('resources.title')} - DrHukum`} />
        <meta property="og:description" content={t('resources.subtitle')} />
      </Helmet>

      <div className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('resources.title').split(' ')[0]}{' '}
                <span className="gradient-text">
                  {t('resources.title').substring(t('resources.title').indexOf(' ') + 1)}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('resources.subtitle')}
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 md:gap-4"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white text-gray-700 hover:bg-blue-50 shadow'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'blog' && (
            <motion.section
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-20 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('resources.blog.sectionTitle')}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('resources.blog.sectionSubtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                    <motion.article
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-xs">{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={handleUnimplemented}
                          >
                            {t('articles.readMore')}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={handleUnimplemented}
                  >
                    {t('resources.blog.viewAll')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'legalUpdates' && (
            <motion.section
              key="legalUpdates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-20 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('resources.legalUpdates.sectionTitle')}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('resources.legalUpdates.sectionSubtitle')}
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                  {legalUpdateItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {item.tag}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar className="h-3.5 w-3.5" />
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.excerpt}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 shrink-0 self-start md:self-center"
                        onClick={handleUnimplemented}
                      >
                        {t('resources.legalUpdates.readMore')}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'freeGuides' && (
            <motion.section
              key="freeGuides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-20 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('resources.freeGuides.sectionTitle')}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('resources.freeGuides.sectionSubtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {guideItems.map((guide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group flex flex-col"
                    >
                      <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <FileText className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                      <p className="text-gray-600 mb-6 flex-1">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {guide.fileType} &middot; {guide.pages}
                        </span>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleUnimplemented}
                        >
                          <Download className="mr-1.5 h-4 w-4" />
                          {t('resources.freeGuides.downloadLabel')}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('resources.ctaTitle')}
              </h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t('resources.ctaSubtitle')}
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                onClick={handleConsultation}
              >
                {t('resources.ctaButton')}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Resources;
