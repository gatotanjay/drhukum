import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Clock, ArrowLeft, Loader2, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { publicApi } from '@/lib/adminApi';

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const locale = ['id', 'en', 'zh'].includes(i18n.language) ? i18n.language : 'id';

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    window.scrollTo(0, 0);

    publicApi.getPost(id, locale)
      .then((res) => {
        if (!cancelled) setPost(res.post);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => !cancelled && setIsLoading(false));

    return () => { cancelled = true; };
  }, [id, locale]);

  const backPath = post?.type === 'legal_update' ? '/wawasan' : '/wawasan';

  if (isLoading) {
    return (
      <div className="pt-16 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">{t('articleDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="pt-16 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FileWarning className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('articleDetail.notFoundTitle')}
          </h1>
          <p className="text-gray-500 mb-6">{t('articleDetail.notFoundDesc')}</p>
          <Button onClick={() => navigate('/wawasan')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('articleDetail.backToResources')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - DrHukum</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} - DrHukum`} />
        <meta property="og:description" content={post.excerpt} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
      </Helmet>

      <article className="pt-16">
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to={backPath}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('articleDetail.backToResources')}
              </Link>

              {post.category && (
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                )}
                {post.post_date && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {post.post_date}
                  </span>
                )}
                {post.read_time && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.read_time}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12"
        >
          <img
            src={post.thumbnail || DEFAULT_THUMBNAIL}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          {post.content ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-gray-600 text-lg">{post.excerpt}</p>
          )}
        </motion.div>

        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('resources.ctaTitle')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto opacity-90 mb-8">
              {t('resources.ctaSubtitle')}
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/kontak');
              }}
            >
              {t('resources.ctaButton')}
            </Button>
          </div>
        </section>
      </article>
    </>
  );
};

export default ArticleDetail;
