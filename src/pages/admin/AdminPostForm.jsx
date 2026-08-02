import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';
import QuillEditor from '@/components/admin/QuillEditor';

const LOCALES = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

const emptyTranslations = { id: { title: '', excerpt: '', content: '' }, en: { title: '', excerpt: '', content: '' }, zh: { title: '', excerpt: '', content: '' } };

const AdminPostForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeLocale, setActiveLocale] = useState('id');

  const [type, setType] = useState('blog');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState('');
  const [author, setAuthor] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState('draft');
  const [translations, setTranslations] = useState(emptyTranslations);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.getPost(id)
      .then((res) => {
        const p = res.post;
        setType(p.type);
        setCategory(p.category || '');
        setThumbnail(p.thumbnail || '');
        setPostDate(p.post_date);
        setReadTime(p.read_time || '');
        setAuthor(p.author || '');
        setFeatured(!!p.featured);
        setStatus(p.status);
        setTranslations({
          id: p.translations.id || { title: '', excerpt: '', content: '' },
          en: p.translations.en || { title: '', excerpt: '', content: '' },
          zh: p.translations.zh || { title: '', excerpt: '', content: '' },
        });
      })
      .catch((err) => toast({ title: 'Gagal memuat post', description: err.message, variant: 'destructive' }))
      .finally(() => setIsLoading(false));
  }, [id, isEdit]);

  const updateTranslation = (locale, field, value) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  };

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
    setIsSaving(true);
    try {
      await adminApi.savePost({
        action: isEdit ? 'update' : 'create',
        id: isEdit ? Number(id) : undefined,
        type,
        category,
        thumbnail,
        post_date: postDate,
        read_time: readTime,
        author,
        featured,
        status: publishStatus,
        translations,
      });
      toast({ title: isEdit ? 'Post berhasil diperbarui' : 'Post berhasil dibuat' });
      navigate('/admin');
    } catch (err) {
      toast({ title: 'Gagal menyimpan', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Post' : 'Tambah Post'} - Admin DrHukum</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Post' : 'Tambah Post Baru'}</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Info Umum */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Info Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipe Post</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="legal_update">Legal Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{type === 'blog' ? 'Kategori' : 'Tag'}</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1" placeholder={type === 'blog' ? 'mis. Legal Service' : 'mis. Imigrasi'} />
              </div>
              <div>
                <Label>Tanggal</Label>
                <Input type="date" value={postDate} onChange={(e) => setPostDate(e.target.value)} className="mt-1" />
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
              {type === 'blog' && (
                <>
                  <div>
                    <Label>Waktu Baca</Label>
                    <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} className="mt-1" placeholder="mis. 8 menit baca" />
                  </div>
                  <div>
                    <Label>Penulis</Label>
                    <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1" placeholder="mis. Dr. Made Sutrisna" />
                  </div>
                </>
              )}
            </div>

            {type === 'blog' && (
              <div className="flex items-center gap-3">
                <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
                <Label htmlFor="featured" className="cursor-pointer">Tampilkan sebagai artikel unggulan (featured)</Label>
              </div>
            )}

            {/* Thumbnail */}
            <div>
              <Label>Thumbnail</Label>
              <div className="mt-1 flex items-start gap-4">
                {thumbnail ? (
                  <div className="relative">
                    <img src={thumbnail} alt="thumbnail" className="w-40 h-28 object-cover rounded-lg border" />
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
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {isUploading ? 'Mengupload...' : 'Upload Gambar'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={isUploading} />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, atau GIF. Maks 5MB.</p>
            </div>
          </div>

          {/* Konten per bahasa */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Konten (per bahasa)</h2>
            <Tabs value={activeLocale} onValueChange={setActiveLocale}>
              <TabsList>
                {LOCALES.map((l) => (
                  <TabsTrigger key={l.code} value={l.code}>{l.label}</TabsTrigger>
                ))}
              </TabsList>
              {LOCALES.map((l) => (
                <TabsContent key={l.code} value={l.code} className="space-y-4 pt-4">
                  <div>
                    <Label>Judul ({l.label})</Label>
                    <Input
                      value={translations[l.code].title}
                      onChange={(e) => updateTranslation(l.code, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Ringkasan / Excerpt ({l.label})</Label>
                    <Textarea
                      value={translations[l.code].excerpt}
                      onChange={(e) => updateTranslation(l.code, 'excerpt', e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Isi Artikel Lengkap ({l.label})</Label>
                    <div className="mt-1 border border-gray-200 rounded-lg overflow-hidden">
                      <QuillEditor
                        value={translations[l.code].content}
                        onChange={(html) => updateTranslation(l.code, 'content', html)}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button variant="outline" onClick={() => navigate('/admin')} disabled={isSaving}>
              Batal
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan sebagai Draft'}
            </Button>
            <Button onClick={() => handleSave('published')} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? 'Menyimpan...' : 'Publish'}
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPostForm;
