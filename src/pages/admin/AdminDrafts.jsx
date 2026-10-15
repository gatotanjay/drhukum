import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Pencil, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';

const PAGE_SIZE = 8;

// Pilihan jenis dokumen hukum untuk form draft
const JENIS_OPTIONS = [
  'Surat Perjanjian',
  'Kontrak',
  'Akta',
  'Surat Kuasa',
  'Legal Opinion',
  'Memorandum Hukum',
  'Peraturan Perusahaan',
  'Dokumen Litigasi',
  'Lainnya',
];

// Konfigurasi badge per status draft
const STATUS_BADGES = {
  selesai: { label: 'Selesai', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  proses: { label: 'Dalam Proses', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  draft: { label: 'Draft', className: '' },
};

const EMPTY_FORM = { id: null, title: '', jenis: '', jenisCustom: '', status: 'draft', notes: '' };

const AdminDrafts = () => {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const loadDrafts = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listDrafts();
      setDrafts(res.drafts);
    } catch (err) {
      toast({ title: 'Gagal memuat data', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (draft) => {
    const knownJenis = JENIS_OPTIONS.some((j) => j !== 'Lainnya' && j === draft.jenis);
    setForm({
      id: draft.id,
      title: draft.title || '',
      jenis: knownJenis ? draft.jenis : 'Lainnya',
      jenisCustom: knownJenis ? '' : draft.jenis || '',
      status: draft.status || 'draft',
      notes: draft.notes || '',
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    const jenis = form.jenis === 'Lainnya' ? form.jenisCustom.trim() : form.jenis;
    if (!form.title.trim() || !jenis) {
      toast({ title: 'Judul dan jenis dokumen wajib diisi', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        action: form.id ? 'update' : 'create',
        title: form.title.trim(),
        jenis,
        status: form.status,
        notes: form.notes.trim(),
      };
      if (form.id) payload.id = form.id;
      const res = await adminApi.saveDraft(payload);

      if (form.id) {
        setDrafts((prev) => prev.map((d) => (d.id === form.id ? { ...d, ...payload, id: form.id } : d)));
        toast({ title: 'Draft berhasil diperbarui' });
      } else {
        setDrafts((prev) => [{ ...payload, id: res.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...prev]);
        toast({ title: 'Draft berhasil ditambahkan' });
      }
      setFormOpen(false);
    } catch (err) {
      toast({ title: 'Gagal menyimpan draft', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteDraft(deleteTarget.id);
      toast({ title: 'Draft berhasil dihapus' });
      setDrafts((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    } catch (err) {
      toast({ title: 'Gagal menghapus', description: err.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const visibleDrafts = drafts.slice(0, visibleCount);
  const hasMore = visibleCount < drafts.length;

  return (
    <>
      <Helmet>
        <title>Draft - Admin DrHukum</title>
      </Helmet>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Draft Dokumen</h2>
            <p className="text-sm text-gray-500">{drafts.length} draft dokumen pekerjaan hukum</p>
          </div>
          <Button onClick={openCreate} className="bg-admin-navy hover:bg-admin-navyLight text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Draft
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-admin-gold" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Belum ada draft dokumen. Klik "Tambah Draft" untuk membuat yang pertama.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Draft</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleDrafts.map((draft) => {
                  const badge = STATUS_BADGES[draft.status] || STATUS_BADGES.draft;
                  return (
                    <TableRow key={draft.id}>
                      <TableCell className="font-medium">{draft.title}</TableCell>
                      <TableCell className="text-gray-600">{draft.jenis}</TableCell>
                      <TableCell>
                        <Badge
                          variant={badge.className ? 'default' : 'secondary'}
                          className={badge.className}
                        >
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(draft)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(draft)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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

      {/* Form tambah/edit draft */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Draft' : 'Tambah Draft'}</DialogTitle>
            <DialogDescription>
              {form.id ? 'Perbarui informasi draft dokumen pekerjaan hukum.' : 'Catat draft dokumen pekerjaan hukum baru untuk dipantau.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Judul Draft <span className="text-red-500">*</span></Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1"
                placeholder="mis. Perjanjian Kerja Sama PT ABC"
              />
            </div>

            <div>
              <Label>Jenis Dokumen <span className="text-red-500">*</span></Label>
              <Select value={form.jenis} onValueChange={(v) => setForm((f) => ({ ...f, jenis: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih jenis dokumen" /></SelectTrigger>
                <SelectContent>
                  {JENIS_OPTIONS.map((j) => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.jenis === 'Lainnya' && (
                <Input
                  value={form.jenisCustom}
                  onChange={(e) => setForm((f) => ({ ...f, jenisCustom: e.target.value }))}
                  className="mt-2"
                  placeholder="Tulis jenis dokumen"
                />
              )}
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="proses">Dalam Proses</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Catatan</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="mt-1"
                rows={3}
                placeholder="Catatan internal (opsional)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-admin-navy hover:bg-admin-navyLight text-white">
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {form.id ? 'Simpan Perubahan' : 'Tambah Draft'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus draft ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
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

export default AdminDrafts;
