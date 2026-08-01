import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const Footer = () => {
  const {
    t
  } = useTranslation();
  const logoUrl = '/logo.png';
  const drHukumLogoUrl = "https://horizons-cdn.hostinger.com/e7ed38b8-8ccd-40b5-adee-dcefd1dbddc9/93e5181bbaca672fac9d44dedeb58e0d.png";
  const handleSocialClick = url => {
    window.open(url, '_blank');
  };
  return <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logoUrl} alt="Logo DrHukum" className="h-20" />
            </Link>
            <p className="text-stone-300 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Instagram className="h-5 w-5 text-stone-400 hover:text-primary cursor-pointer transition-colors" onClick={() => handleSocialClick('https://www.instagram.com/drhukumofficial/')} />
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-lg font-semibold">{t('footer.navigation')}</span>
            <div className="space-y-2">
              <Link to="/" className="block text-stone-300 hover:text-white transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/tentang-kami" className="block text-stone-300 hover:text-white transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/layanan" className="block text-stone-300 hover:text-white transition-colors">
                {t('nav.services')}
              </Link>
              <Link to="/industri" className="block text-stone-300 hover:text-white transition-colors">
                {t('nav.industries')}
              </Link>
              <Link to="/sumber-daya" className="block text-stone-300 hover:text-white transition-colors">
                {t('nav.resources')}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-lg font-semibold">{t('footer.mainServices')}</span>
            <div className="space-y-2">
              <p className="text-stone-300">{t('footer.legalService')}</p>
              <p className="text-stone-300">{t('footer.visaImmigration')}</p>
              <p className="text-stone-300">{t('footer.taxAccounting')}</p>
              <p className="text-stone-300">{t('footer.permit')}</p>
              <p className="text-stone-300">{t('footer.retainerLawyer')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-lg font-semibold">{t('footer.contact')}</span>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-stone-300 text-sm">Jl Buana Kubu No.47, Kel/Desa Tegal Harum, Kecamatan Denpasar Barat, Kota Denpasar, Provinsi Bali - 80119</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="text-stone-300">+62 853 5353 6667</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-stone-300">info@drhukum.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-stone-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;