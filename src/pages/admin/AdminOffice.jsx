import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Pencil, Trash2, Loader2, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';

const PAGE_SIZE = 8;

// Format timestamp MySQL jadi teks relatif ("2 menit lalu", "3 hari lalu", dst)
function timeAgo(mysqlDatetime) {
  if (!mysqlDatetime) return '-';
  const date = new Date(mysqlDatetime.replace(' ', 'T'));
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  return `${Math.floor(diffMonth / 12)} tahun lalu`;
}

const AdminOffice = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewDetail, setViewDetail] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listPosts();
      setPosts(res.posts.filter((p) => p.type === 'sop'));
    } catch (err) {
      toast({ title: 'Gagal memuat data', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openView = async (post) => {
    setViewTarget(post);
    setViewLoading(true);
    setViewDetail(null);
    try {
      const res = await adminApi.getPost(post.id);
      setViewDetail(res.post);
    } catch (err) {
      toast({ title: 'Gagal memuat detail SOP', description: err.message, variant: 'destructive' });
    } finally {
      setViewLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deletePost(deleteTarget.id);
      toast({ title: 'SOP berhasil dihapus' });
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

  return (
    <>
      <Helmet>
        <title>Manajemen Kantor - Admin DrHukum</title>
      </Helmet>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">SOP (Standard Operating Procedure)</h2>
          <Link to="/admin/office/new">
            <Button className="bg-admin-navy hover:bg-admin-navyLight text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah SOP
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-admin-gold" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Belum ada SOP. Klik "Tambah SOP" untuk membuat yang pertama.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SOP</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Terakhir Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {post.title_id || <span className="text-gray-400 italic">(tanpa judul)</span>}
                        {post.status !== 'published' && (
                          <Badge variant="secondary" className="text-[10px]">Draft</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{post.category}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{timeAgo(post.updated_at)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(post)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link to={`/admin/office/${post.id}/edit`}>
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
                ))}
              </TableBody>
            </Table>

            {hasMore && (
              <div className="text-center py-5 border-t border-gray-100">
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

      {/* Modal Lihat SOP */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewTarget?.title_id}</DialogTitle>
            <DialogDescription>{viewTarget?.category}</DialogDescription>
          </DialogHeader>

          {viewLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-admin-gold" />
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: viewDetail?.translations?.id?.content || '<p class="text-gray-400 italic">Belum ada isi.</p>' }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus SOP ini?</AlertDialogTitle>
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

export default AdminOffice;
