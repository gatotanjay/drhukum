import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Calendar, ChevronRight, Filter, Loader2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '@/lib/adminApi';
import ArticlePagination from '@/components/ArticlePagination';

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80';

// Jumlah update per halaman pada grid
const PAGE_SIZE = 9;

const ClientUpdates = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  const locale = ['id', 'en', 'zh'].includes(i18n.language) ? i18n.language : 'id';

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    publicApi.getPosts('client_update', locale)
      .then((res) => {
        if (!cancelled) setUpdates(res.posts);
      })
      .catch(() => {
        if (!cancelled) setUpdates([]);
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, [locale]);

  const handleReadMore = (id) => {
    window.scrollTo(0, 0);
    navigate(`/artikel/${id}`);
  };

  const handleConsultation = () => {
    window.scrollTo(0, 0);
    navigate('/kontak');
  };

  // Kategori dibangun dinamis dari update yang ada
  const categories = ['Semua', ...new Set(updates.map((u) => u.category).filter(Boolean))];

  const filteredUpdates = updates.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset ke halaman 1 setiap kali filter/pencarian/data berubah
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchTerm, updates]);

  const totalPages = Math.max(1, Math.ceil(filteredUpdates.length / PAGE_SIZE));
  const paginatedUpdates = filteredUpdates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Helmet>
        <title>{t('clientUpdates.title')} - DrHukum</title>
        <meta name="description" content={t('clientUpdates.subtitle')} />
        <meta property="og:title" content={`${t('clientUpdates.title')} - DrHukum`} />
        <meta property="og:description" content={t('clientUpdates.subtitle')} />
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
                <span className="gradient-text">{t('clientUpdates.title')}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('clientUpdates.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t('clientUpdates.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === 'Semua' ? t('clientUpdates.allCategories') : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Daftar update */}
        <section className="py-20 bg-white">
          <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredUpdates.length === 0 ? (
              <div className="text-center py-16">
                <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {updates.length === 0
                    ? t('clientUpdates.empty')
                    : t('clientUpdates.noResults')}
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <p className="text-xl text-gray-600">
                    {filteredUpdates.length} {t('clientUpdates.found')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedUpdates.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100"
                    >
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={item.thumbnail || DEFAULT_THUMBNAIL}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          {item.category ? (
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar className="h-3.5 w-3.5" />
                            {item.post_date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3 flex-1">{item.excerpt}</p>
                        <Button
                          variant="ghost"
                          className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleReadMore(item.id)}
                        >
                          {t('clientUpdates.readMore')}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="mt-14">
                  <ArticlePagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    scrollTargetRef={gridRef}
                  />
                </div>
              </>
            )}
          </div>
        </section>

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
              <h2 className="text-3xl md:text-4xl font-bold">{t('resources.ctaTitle')}</h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">{t('resources.ctaSubtitle')}</p>
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

export default ClientUpdates;
