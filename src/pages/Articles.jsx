import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const Articles = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleReadMore = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  const categories = [
    'Semua', 'Hukum Perdata', 'Hukum Pidana', 'Hukum Bisnis', 'Hukum Keluarga', 'Hukum Properti', 'Hukum Ketenagakerjaan', 'Tips Hukum'
  ];

  const translatedCategories = {
    'Semua': t('articles.allCategories'),
    'Hukum Perdata': t('articles.categories.civil'),
    'Hukum Pidana': t('articles.categories.criminal'),
    'Hukum Bisnis': t('articles.categories.business'),
    'Hukum Keluarga': t('articles.categories.family'),
    'Hukum Properti': t('articles.categories.property'),
    'Hukum Ketenagakerjaan': t('articles.categories.labor'),
    'Tips Hukum': t('articles.categories.tips')
  };

  const articles = [
    {
      id: 1, title: t('home.blogPosts.post1'), excerpt: t('home.blogPosts.post1Excerpt'),
      content: "Artikel ini membahas secara komprehensif tentang hukum bisnis di Indonesia, termasuk regulasi terbaru, compliance, dan strategi mitigasi risiko.",
      author: "Dr. Made Sutrisna", date: "15 Januari 2024", category: t('articles.categories.business'),
      readTime: `8 ${t('articles.readTime')}`, featured: true
    },
    {
      id: 2, title: t('home.blogPosts.post2'), excerpt: t('home.blogPosts.post2Excerpt'),
      content: "Panduan praktis tentang kontrak kerja, termasuk klausul-klausul penting, hak cuti, pesangon, dan penyelesaian sengketa.",
      author: "Ni Luh Kadek Sari", date: "12 Januari 2024", category: t('articles.categories.labor'),
      readTime: `6 ${t('articles.readTime')}`, featured: false
    },
    {
      id: 3, title: t('home.blogPosts.post3'), excerpt: t('home.blogPosts.post3Excerpt'),
      content: "Tutorial step-by-step pendirian PT, mulai dari persiapan dokumen hingga pengurusan izin usaha.",
      author: "I Gede Wirawan", date: "10 Januari 2024", category: t('articles.categories.business'),
      readTime: `10 ${t('articles.readTime')}`, featured: false
    },
    {
      id: 4, title: "Mengatasi Sengketa Properti: Tips dan Strategi", excerpt: "Cara efektif menyelesaikan sengketa properti dan tanah dengan pendekatan hukum yang tepat dan efisien.",
      author: "Dr. Made Sutrisna", date: "8 Januari 2024", category: t('articles.categories.property'),
      readTime: `7 ${t('articles.readTime')}`, featured: true
    },
    {
      id: 5, title: "Perlindungan Hukum untuk Korban KDRT", excerpt: "Memahami hak-hak korban kekerasan dalam rumah tangga dan langkah hukum yang dapat diambil untuk perlindungan.",
      author: "Ni Luh Kadek Sari", date: "5 Januari 2024", category: t('articles.categories.family'),
      readTime: `9 ${t('articles.readTime')}`, featured: false
    },
    {
      id: 6, title: "Aspek Hukum dalam Transaksi E-Commerce", excerpt: "Regulasi dan perlindungan hukum dalam bisnis online, termasuk hak konsumen dan kewajiban pelaku usaha.",
      author: "I Gede Wirawan", date: "3 Januari 2024", category: t('articles.categories.business'),
      readTime: `8 ${t('articles.readTime')}`, featured: false
    },
    {
      id: 7, title: "Mediasi sebagai Alternatif Penyelesaian Sengketa", excerpt: "Keuntungan menggunakan mediasi dalam menyelesaikan sengketa hukum dibandingkan dengan litigasi di pengadilan.",
      author: "Putu Ayu Dewi", date: "1 Januari 2024", category: t('articles.categories.tips'),
      readTime: `5 ${t('articles.readTime')}`, featured: false
    },
    {
      id: 8, title: "Update Regulasi Hukum Pidana Terbaru", excerpt: "Perubahan dan update terbaru dalam hukum pidana Indonesia yang perlu diketahui masyarakat umum.",
      author: "Ni Luh Kadek Sari", date: "28 Desember 2023", category: t('articles.categories.criminal'),
      readTime: `12 ${t('articles.readTime')}`, featured: true
    }
  ];

  const filteredArticles = articles.filter(article => {
    const originalCategory = Object.keys(translatedCategories).find(key => translatedCategories[key] === article.category);
    const matchesCategory = selectedCategory === 'Semua' || originalCategory === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(article => article.featured);

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
                      {categories.map(category => (
                        <option key={category} value={category}>{translatedCategories[category]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {selectedCategory === 'Semua' && searchTerm === '' && (
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
                     src="https://images.unsplash.com/photo-1682253406151-45237a6f7acf" />
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm">{article.readTime}</span>
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
                          <span className="text-sm text-gray-600">{article.date}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={handleReadMore}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {selectedCategory === 'Semua' ? t('articles.allArticlesTitle') : `${translatedCategories[selectedCategory]}`}
              </h2>
              <p className="text-xl text-gray-600">
                {filteredArticles.length} {t('articles.articlesFound')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
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
                   src="https://images.unsplash.com/photo-1672419596694-185c04f15c6e" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">{article.readTime}</span>
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
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={handleReadMore}
                    >
                      {t('articles.readMore')}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  {t('articles.noArticlesFound')} "{translatedCategories[selectedCategory]}" 
                  {searchTerm && ` ${t('articles.withKeyword')} "${searchTerm}"`}.
                </p>
              </motion.div>
            )}
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