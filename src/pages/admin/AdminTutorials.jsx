import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Plus, Pencil, Trash2, Loader2, GraduationCap, PlayCircle, ChevronDown, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';

const PAGE_SIZE = 6;

// Ubah link YouTube/Vimeo biasa jadi URL embed, supaya bisa diputar langsung di modal
function getEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const videoId = u.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (u.pathname.startsWith('/embed/')) return url;
    }
    if (u.hostname === 'youtu.be') {
      const videoId = u.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const match = u.pathname.match(/\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

const TutorialThumbnail = ({ thumbnail, title }) => {
  if (thumbnail) {
    return <img src={thumbnail} alt={title} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-admin-gold/20 to-admin-navy/10 flex items-center justify-center">
      <GraduationCap className="h-12 w-12 text-admin-goldDark/60" />
    </div>
  );
};

const AdminTutorials = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listPosts();
      setPosts(res.posts.filter((p) => p.type === 'tutorial'));
    } catch (err) {
      toast({ title: 'Gagal memuat data', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deletePost(deleteTarget.id);
      toast({ title: 'Tutorial berhasil dihapus' });
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (err) {
      toast({ title: 'Gagal menghapus', description: err.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;
  const embedUrl = useMemo(() => getEmbedUrl(viewTarget?.video_url), [viewTarget]);

  return (
    <>
      <Helmet>
        <title>Tutorial - Admin DrHukum</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daftar Tutorial</h2>
          <p className="text-sm text-gray-500">{posts.length} tutorial total</p>
        </div>
        <Link to="/admin/tutorials/new">
          <Button className="bg-admin-navy hover:bg-admin-navyLight text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tutorial Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-admin-gold" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Belum ada tutorial. Klik "Tambah Tutorial Baru" untuk membuat yang pertama.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Aksi admin (edit/hapus) - muncul saat hover */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/admin/tutorials/${post.id}/edit`}>
                      <button className="bg-white/90 hover:bg-white shadow rounded-lg p-1.5 text-gray-600 hover:text-admin-navy">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="bg-white/90 hover:bg-white shadow rounded-lg p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {!!post.video_url && (
                    <div className="absolute top-2 left-2 z-10 bg-black/60 text-white rounded-full p-1.5">
                      <PlayCircle className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div className="aspect-[4/3]">
                    <TutorialThumbnail thumbnail={post.thumbnail} title={post.title_id} />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {post.status !== 'published' && (
                        <Badge variant="secondary" className="text-[10px]">Draft</Badge>
                      )}
                      {post.category && (
                        <span className="text-[11px] font-medium text-admin-goldDark uppercase tracking-wide">{post.category}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
                      {post.title_id || <span className="text-gray-400 italic font-normal">(tanpa judul)</span>}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt_id}</p>
                    <Button
                      onClick={() => setViewTarget(post)}
                      className="w-full bg-admin-navy hover:bg-admin-navyLight text-white"
                    >
                      Lihat Tutorial
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-admin-goldDark hover:text-admin-navy"
                >
                  Lihat Selengkapnya
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Lihat Tutorial */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewTarget?.title_id}</DialogTitle>
            <DialogDescription>{viewTarget?.category}</DialogDescription>
          </DialogHeader>

          {viewTarget?.video_url && (
            embedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={embedUrl}
                  title={viewTarget.title_id}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <a
                href={viewTarget.video_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-admin-goldDark hover:underline"
              >
                Tonton video <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )
          )}

          {viewTarget?.excerpt_id && (
            <p className="text-gray-600 text-sm">{viewTarget.excerpt_id}</p>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tutorial ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title_id}" akan dihapus permanen beserta semua terjemahannya (ID/EN/ZH). Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminTutorials;
