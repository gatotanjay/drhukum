import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Pencil, Trash2, Loader2, FileText, Scale, GraduationCap, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';

const TYPE_META = {
  blog: { icon: FileText, label: 'Blog' },
  legal_update: { icon: Scale, label: 'Legal Update' },
  tutorial: { icon: GraduationCap, label: 'Tutorial' },
};

/**
 * Daftar post. Dipakai untuk 2 route:
 * - /admin/posts     -> mode="posts"    (Blog + Legal Update)
 * - /admin/tutorials -> mode="tutorial" (khusus Tutorial)
 */
const AdminDashboard = ({ mode = 'posts' }) => {
  const isTutorialMode = mode === 'tutorial';
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listPosts();
      const filtered = res.posts.filter((p) =>
        isTutorialMode ? p.type === 'tutorial' : p.type !== 'tutorial'
      );
      setPosts(filtered);
    } catch (err) {
      toast({ title: 'Gagal memuat data', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deletePost(deleteTarget.id);
      toast({ title: 'Post berhasil dihapus' });
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (err) {
      toast({ title: 'Gagal menghapus', description: err.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const basePath = isTutorialMode ? '/admin/tutorials' : '/admin/posts';
  const addLabel = isTutorialMode ? 'Tambah Tutorial Baru' : 'Tambah Post Baru';

  return (
    <>
      <Helmet>
        <title>{isTutorialMode ? 'Tutorial' : 'Artikel & Blog'} - Admin DrHukum</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">{posts.length} {isTutorialMode ? 'tutorial' : 'post'} total</p>
        <Link to={`${basePath}/new`}>
          <Button className="bg-admin-navy hover:bg-admin-navyLight text-white">
            <Plus className="h-4 w-4 mr-2" />
            {addLabel}
          </Button>
        </Link>
      </div>

      <div className={isTutorialMode ? '' : 'bg-white rounded-xl shadow overflow-hidden'}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-admin-gold" />
          </div>
        ) : posts.length === 0 ? (
          <div className={`text-center py-16 text-gray-500 ${isTutorialMode ? 'bg-white rounded-xl shadow' : ''}`}>
            Belum ada {isTutorialMode ? 'tutorial' : 'post'}. Klik "{addLabel}" untuk membuat yang pertama.
          </div>
        ) : isTutorialMode ? (
          /* ── Grid card khusus tutorial ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col group">
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-gray-100">
                  {post.video_url ? (
                    <a href={post.video_url} target="_blank" rel="noreferrer" className="block w-full h-full group/thumb">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title_id || 'thumbnail'}
                          className="w-full h-full object-cover transition-opacity group-hover/thumb:opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
                          <ImageOff className="h-8 w-8" />
                          <span className="text-xs">Belum ada thumbnail</span>
                        </div>
                      )}
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 group-hover/thumb:bg-black/70 transition-colors rounded-full p-3">
                          <svg className="h-7 w-7 text-white fill-white" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ) : post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title_id || 'thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
                      <ImageOff className="h-8 w-8" />
                      <span className="text-xs">Belum ada thumbnail</span>
                    </div>
                  )}
                  {/* Status badge di atas thumbnail */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <Badge
                      className={
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100 shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-100 shadow-sm'
                      }
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                {/* Body card */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                    {post.title_id || <span className="text-gray-400 italic">(tanpa judul)</span>}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {post.category && (
                      <span className="text-xs bg-admin-gold/10 text-admin-goldDark px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    )}
                    {post.read_time && (
                      <span className="text-xs text-gray-400">{post.read_time}</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">{post.post_date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 border-t border-gray-100 px-3 py-2">
                  <Link to={`${basePath}/${post.id}/edit`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full justify-center gap-1.5 text-gray-600 hover:text-admin-navy">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteTarget(post)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Tabel biasa untuk posts/artikel ── */
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul (ID)</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                const meta = TYPE_META[post.type] || TYPE_META.blog;
                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.title_id || <span className="text-gray-400 italic">(tanpa judul)</span>}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                        <meta.icon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{post.category}</TableCell>
                    <TableCell className="text-gray-600">{post.post_date}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}
                        className={post.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                      {!!post.featured && (
                        <Badge variant="outline" className="ml-1.5 border-admin-gold/40 text-admin-goldDark">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link to={`${basePath}/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteTarget(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {isTutorialMode ? 'tutorial' : 'post'} ini?</AlertDialogTitle>
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

export default AdminDashboard;
