import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Pencil, Trash2, Loader2, FileText, Scale, GraduationCap, Video } from 'lucide-react';
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-admin-gold" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Belum ada {isTutorialMode ? 'tutorial' : 'post'}. Klik "{addLabel}" untuk membuat yang pertama.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul (ID)</TableHead>
                {!isTutorialMode && <TableHead>Tipe</TableHead>}
                <TableHead>Kategori</TableHead>
                {isTutorialMode && <TableHead>Video</TableHead>}
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
                    {!isTutorialMode && (
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                          <meta.icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-gray-600">{post.category}</TableCell>
                    {isTutorialMode && (
                      <TableCell>
                        {post.video_url ? (
                          <a href={post.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-admin-goldDark hover:underline text-sm">
                            <Video className="h-3.5 w-3.5" /> Lihat
                          </a>
                        ) : (
                          <span className="text-gray-300 text-sm">-</span>
                        )}
                      </TableCell>
                    )}
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
