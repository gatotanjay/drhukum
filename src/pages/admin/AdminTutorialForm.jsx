import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Loader2, Upload, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';
import QuillEditor from '@/components/admin/QuillEditor';

const AdminTutorialForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('draft');

  // Hanya bahasa Indonesia
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminApi.getPost(id)
      .then((res) => {
        const p = res.post;
        setCategory(p.category || '');
        setThumbnail(p.thumbnail || '');
        setVideoUrl(p.video_url || '');
        setPostDate(p.post_date);
        setReadTime(p.read_time || '');
        setAuthor(p.author || '');
        setStatus(p.status);
        const tr = p.translations?.id || {};
        setTitle(tr.title || '');
        setExcerpt(tr.excerpt || '');
        setContent(tr.content || '');
      })
      .catch((err) =>
        toast({ title: 'Gagal memuat tutorial', description: err.message, variant: 'destructive' })
      )
      .finally(() => setIsLoading(false));
  }, [id, isEdit]);

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await adminApi.uploadThumbnail(file);
      setThumbnail(res.url);
    } catch (err) {
      toast({ title: 'Gagal upload thumbnail', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (publishStatus) => {
    if (!title.trim()) {
      toast({ title: 'Judul wajib diisi', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      // Salin konten ID ke EN dan ZH agar validasi backend terpenuhi
      const fallback = { title, excerpt, content };
      await adminApi.savePost({
        action: isEdit ? 'update' : 'create',
        id: isEdit ? Number(id) : undefined,
        type: 'tutorial',
        category,
        thumbnail,
        video_url: videoUrl,
        post_date: postDate,
        read_time: readTime,
        author,
        featured: false,
        status: publishStatus,
        translations: {
          id: fallback,
          en: fallback,
          zh: fallback,
        },
      });
      toast({ title: isEdit ? 'Tutorial berhasil diperbarui' : 'Tutorial berhasil dibuat' });
      navigate('/admin/tutorials');
    } catch (err) {
      toast({ title: 'Gagal menyimpan', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-admin-gold" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Tutorial' : 'Tambah Tutorial'} - Admin DrHukum</title>
      </Helmet>

      <div className="space-y-6">
        <Link
          to="/admin/tutorials"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar tutorial
        </Link>

        {/* Info Umum */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Info Tutorial</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Judul Tutorial <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                placeholder="mis. Cara Mengurus SIUP Online"
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1"
                placeholder="mis. Panduan Perizinan"
              />
            </div>
            <div>
              <Label>Dibuat oleh</Label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1"
                placeholder="mis. Dr. Made Sutrisna"
              />
            </div>
            <div>
              <Label>Durasi</Label>
              <Input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="mt-1"
                placeholder="mis. 12 menit"
              />
            </div>
            <div>
              <Label>Tanggal</Label>
              <Input
                type="date"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link Video */}
            <div className="md:col-span-2">
              <Label className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" /> Link Video (YouTube/Vimeo)
              </Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Opsional. Kosongkan kalau tutorial ini hanya berupa teks/panduan tertulis.
              </p>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail</Label>
            <div className="mt-1 flex items-start gap-4">
              {thumbnail ? (
                <div className="relative">
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    className="w-40 h-28 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center px-2">
                  Belum ada thumbnail
                </div>
              )}
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  {isUploading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Upload className="h-4 w-4" />}
                  {isUploading ? 'Mengupload...' : 'Upload Gambar'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, atau GIF. Maks 5MB.</p>
          </div>
        </div>

        {/* Konten */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Konten</h2>

          <div>
            <Label>Ringkasan / Excerpt</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="Deskripsi singkat tutorial ini..."
            />
          </div>

          <div>
            <Label>Isi Lengkap</Label>
            <div className="mt-1 border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor
                value={content}
                onChange={(html) => setContent(html)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => navigate('/admin/tutorials')} disabled={isSaving}>
            Batal
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan sebagai Draft'}
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="bg-admin-navy hover:bg-admin-navyLight text-white"
          >
            {isSaving ? 'Menyimpan...' : 'Publish'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminTutorialForm;
