import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Scale,
  Calendar,
  User,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '@/lib/adminApi';
import ArticlePagination from '@/components/ArticlePagination';

// Thumbnail sementara untuk post yang belum diisi thumbnail lewat admin panel.
const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80';

// Jumlah artikel blog yang ditampilkan per halaman (menggantikan tombol "Lihat Semua Artikel").
const BLOG_PAGE_SIZE = 6;

const Insight = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blog');
  const [blogPosts, setBlogPosts] = useState([]);
  const [legalUpdateItems, setLegalUpdateItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPage, setBlogPage] = useState(1);
  const blogSectionRef = useRef(null);

  const locale = ['id', 'en', 'zh'].includes(i18n.language) ? i18n.language : 'id';

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([
      publicApi.getPosts('blog', locale),
      publicApi.getPosts('legal_update', locale),
    ])
      .then(([blogRes, legalRes]) => {
        if (cancelled) return;
        setBlogPosts(blogRes.posts);
        setLegalUpdateItems(legalRes.posts);
        setBlogPage(1);
      })
      .catch(() => {
        if (!cancelled) {
          setBlogPosts([]);
          setLegalUpdateItems([]);
        }
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, [locale]);

  const handleReadMore = (postId) => {
    window.scrollTo(0, 0);
    navigate(`/artikel/${postId}`);
  };

  const handleConsultation = () => {
    window.scrollTo(0, 0);
    navigate('/kontak');
  };

  const tabs = [
    { id: 'blog', label: t('resources.tabs.blog'), icon: BookOpen },
    { id: 'legalUpdates', label: t('resources.tabs.legalUpdates'), icon: Scale },
  ];

  // Pagination untuk daftar artikel blog (menggantikan tombol "Lihat Semua Artikel").
  const blogTotalPages = Math.max(1, Math.ceil(blogPosts.length / BLOG_PAGE_SIZE));
  const paginatedBlogPosts = blogPosts.slice(
    (blogPage - 1) * BLOG_PAGE_SIZE,
    blogPage * BLOG_PAGE_SIZE
  );

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
              <div ref={blogSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('resources.blog.sectionTitle')}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('resources.blog.sectionSubtitle')}
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : blogPosts.length === 0 ? (
                  <p className="text-center text-gray-500 py-16">{t('resources.blog.article1')}</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedBlogPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
                    >
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={post.thumbnail || DEFAULT_THUMBNAIL}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-xs">{post.read_time}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.post_date}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleReadMore(post.id)}
                          >
                            {t('articles.readMore')}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
                )}

                {!isLoading && blogPosts.length > 0 && (
                  <div className="mt-14">
                    <ArticlePagination
                      currentPage={blogPage}
                      totalPages={blogTotalPages}
                      onPageChange={setBlogPage}
                      scrollTargetRef={blogSectionRef}
                    />
                  </div>
                )}
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

                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : legalUpdateItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-16">{t('resources.legalUpdates.legal')}</p>
                ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  {legalUpdateItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                    >
                      <div className="w-full md:w-48 h-40 md:h-32 shrink-0 overflow-hidden bg-gray-100 md:rounded-xl">
                        <img
                          src={item.thumbnail || DEFAULT_THUMBNAIL}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 px-6 pb-6 md:px-0 md:pb-0 md:py-6 md:pr-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar className="h-3.5 w-3.5" />
                            {item.post_date}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.excerpt}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 shrink-0 self-start md:self-center mx-6 mb-6 md:mx-0 md:mb-0 md:mr-6"
                        onClick={() => handleReadMore(item.id)}
                      >
                        {t('resources.legalUpdates.readMore')}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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

export default Insight;
