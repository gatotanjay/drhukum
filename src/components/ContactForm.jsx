import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    legalIssue: '',
    message: '',
    urgency: 'normal'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Mohon lengkapi semua field yang wajib diisi", variant: "destructive" });
      return;
    }
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    consultations.push({ id: Date.now(), ...formData, date: new Date().toISOString(), status: 'pending' });
    localStorage.setItem('consultations', JSON.stringify(consultations));
    toast({ title: "Formulir berhasil dikirim!", description: "Tim kami akan menghubungi Anda dalam 24 jam." });
    setFormData({ name: '', email: '', phone: '', subject: '', legalIssue: '', message: '', urgency: 'normal' });
  };

  const legalIssues = [
    "Hukum Perdata", "Hukum Pidana", "Hukum Bisnis & Korporasi", "Hukum Keluarga",
    "Hukum Properti", "Hukum Ketenagakerjaan", "Hukum Administrasi", "Lainnya"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.formTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.fullName')}</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t('contact.fullNamePlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.email')}</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t('contact.emailPlaceholder')} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.phone')}</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t('contact.phonePlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.urgency')}</label>
            <select name="urgency" value={formData.urgency} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="normal">{t('contact.urgencyNormal')}</option>
              <option value="urgent">{t('contact.urgencyUrgent')}</option>
              <option value="emergency">{t('contact.urgencyEmergency')}</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.legalField')}</label>
          <select name="legalIssue" value={formData.legalIssue} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{t('contact.selectLegalField')}</option>
            {legalIssues.map(issue => (<option key={issue} value={issue}>{issue}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.subject')}</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t('contact.subjectPlaceholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.message')}</label>
          <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t('contact.messagePlaceholder')} />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
          <Send className="mr-2 h-5 w-5" />
          {t('contact.sendConsultation')}
        </Button>
      </form>
    </motion.div>
  );
};

export default ContactForm;