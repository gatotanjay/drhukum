import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '@/lib/adminApi';
import ArticlePagination from '@/components/ArticlePagination';

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80';

// Jumlah artikel per halaman di grid "Semua Artikel"
const ARTICLES_PAGE_SIZE = 9;

const Articles = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  const locale = ['id', 'en', 'zh'].includes(i18n.language) ? i18n.language : 'id';

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    publicApi.getPosts('blog', locale)
      .then((res) => {
        if (!cancelled) setArticles(res.posts);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, [locale]);

  const handleReadMore = (articleId) => {
    window.scrollTo(0, 0);
    navigate(`/artikel/${articleId}`);
  };

  // Kategori dibangun dinamis dari artikel yang ada (bukan hardcoded lagi),
  // karena kategori sekarang bebas diisi lewat admin panel.
  const categories = ['Semua', ...new Set(articles.map((a) => a.category).filter(Boolean))];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter((article) => !!article.featured);

  // Reset ke halaman 1 setiap kali filter/pencarian/data berubah
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchTerm, articles]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PAGE_SIZE));
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ARTICLES_PAGE_SIZE,
    page * ARTICLES_PAGE_SIZE
  );

  return (
    <>
      <Helmet>
        <title>{t('articles.title')} - DrHukum | Wawasan Hukum Terkini</title>
        <meta name="description" content="Baca artikel dan insight hukum terbaru dari para ahli DrHukum. Dapatkan wawasan mendalam tentang berbagai aspek hukum di Indonesia." />
        <meta property="og:title" content={`${t('articles.title')} - DrHukum | Wawasan Hukum Terkini`} />
        <meta property="og:description" content="Baca artikel dan insight hukum terbaru dari para ahli DrHukum. Dapatkan wawasan mendalam tentang berbagai aspek hukum di Indonesia." />
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
                {t('articles.title').split(' ')[0]} <span className="gradient-text">& {t('articles.title').split(' ')[1]}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('articles.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t('articles.searchPlaceholder')}
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
                          {category === 'Semua' ? t('articles.allCategories') : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
        <>
        {selectedCategory === 'Semua' && searchTerm === '' && featuredArticles.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {t('articles.featuredTitle')}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('articles.featuredSubtitle')}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredArticles.slice(0, 2).map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <img
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={`Ilustrasi artikel ${article.title}`}
                      src={article.thumbnail || DEFAULT_THUMBNAIL} />
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm">{article.read_time}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{article.author}</span>
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{article.post_date}</span>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleReadMore(article.id)}
                        >
                          {t('articles.readMore')}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {selectedCategory === 'Semua' ? t('articles.allArticlesTitle') : selectedCategory}
              </h2>
              <p className="text-xl text-gray-600">
                {filteredArticles.length} {t('articles.articlesFound')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <img
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={`Ilustrasi artikel ${article.title}`}
                    src={article.thumbnail || DEFAULT_THUMBNAIL} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">{article.read_time}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{article.post_date}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => handleReadMore(article.id)}
                    >
                      {t('articles.readMore')}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredArticles.length > 0 && (
              <div className="mt-14">
                <ArticlePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  scrollTargetRef={gridRef}
                />
              </div>
            )}

            {filteredArticles.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  {articles.length === 0
                    ? 'Belum ada artikel yang dipublikasikan.'
                    : `${t('articles.noArticlesFound')} "${selectedCategory}"${searchTerm ? ` ${t('articles.withKeyword')} "${searchTerm}"` : ''}.`}
                </p>
              </motion.div>
            )}
          </div>
        </section>
        </>
        )}

        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('articles.newsletterTitle')}
              </h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t('articles.newsletterSubtitle')}
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder={t('articles.emailPlaceholder')}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6"
                  onClick={() => toast({
                    title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
                  })}
                >
                  {t('articles.subscribe')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Articles;
