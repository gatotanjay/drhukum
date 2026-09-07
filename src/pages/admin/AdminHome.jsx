import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  FileText, Scale, CheckCircle2, FileEdit, Star, Loader2, Plus, Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminHome = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminApi.listPosts()
      .then((res) => {
        if (!cancelled) setPosts(res.posts);
      })
      .catch((err) => {
        if (!cancelled) toast({ title: 'Gagal memuat data', description: err.message, variant: 'destructive' });
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, []);

  const total = posts.length;
  const published = posts.filter((p) => p.status === 'published').length;
  const draft = posts.filter((p) => p.status === 'draft').length;
  const featured = posts.filter((p) => !!p.featured).length;
  const blogCount = posts.filter((p) => p.type === 'blog').length;
  const legalCount = posts.filter((p) => p.type === 'legal_update').length;
  const recentPosts = posts.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-admin-gold" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin DrHukum</title>
      </Helmet>

      <div className="space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Total Post" value={total} accent="bg-admin-gold/15 text-admin-goldDark" />
          <StatCard icon={CheckCircle2} label="Published" value={published} accent="bg-green-100 text-green-600" />
          <StatCard icon={FileEdit} label="Draft" value={draft} accent="bg-gray-100 text-gray-600" />
          <StatCard icon={Star} label="Featured" value={featured} accent="bg-amber-100 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Breakdown per tipe */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Per Kategori</h2>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" /> Blog
              </span>
              <span className="font-semibold text-gray-900">{blogCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Scale className="h-4 w-4" /> Legal Update
              </span>
              <span className="font-semibold text-gray-900">{legalCount}</span>
            </div>
            <Link to="/admin/posts/new">
              <Button className="w-full bg-admin-navy hover:bg-admin-navyLight mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Post Baru
              </Button>
            </Link>
          </div>

          {/* Post terbaru */}
          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Post Terbaru</h2>
              <Link to="/admin/posts" className="text-sm text-admin-goldDark hover:text-admin-navy">
                Lihat semua &rarr;
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">Belum ada post. Mulai dengan menambah post baru.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 pr-4">
                      <p className="font-medium text-gray-900 truncate">
                        {post.title_id || <span className="text-gray-400 italic">(tanpa judul)</span>}
                      </p>
                      <p className="text-xs text-gray-500">{post.category} &middot; {post.post_date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}
                        className={post.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                      <Link to={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
