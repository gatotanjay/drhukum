import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const Footer = () => {
  const {
    t
  } = useTranslation();
  const drHukumLogoUrl = "https://horizons-cdn.hostinger.com/e7ed38b8-8ccd-40b5-adee-dcefd1dbddc9/93e5181bbaca672fac9d44dedeb58e0d.png";
  const kenariLogoUrl = "https://horizons-cdn.hostinger.com/e7ed38b8-8ccd-40b5-adee-dcefd1dbddc9/c80c0daf69da5fec73fc3ccfd2cb3a6f.png";
  const handleSocialClick = url => {
    window.open(url, '_blank');
  };
  return <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={drHukumLogoUrl} alt="Logo DrHukum" className="h-20" />
            </Link>
            <p className="text-stone-300 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-stone-400 hover:text-primary cursor-pointer transition-colors" onClick={() => handleSocialClick('https://www.facebook.com/drhukumindonesia')} // Assuming a Facebook link
            />
              <Instagram className="h-5 w-5 text-stone-400 hover:text-primary cursor-pointer transition-colors" onClick={() => handleSocialClick('https://www.instagram.com/drhukumindonesia/')} />
              <Linkedin className="h-5 w-5 text-stone-400 hover:text-primary cursor-pointer transition-colors" onClick={() => handleSocialClick('https://www.linkedin.com/company/drhukum')} // Assuming a LinkedIn link
            />
            </div>
            <div className="pt-4">
              <p className="text-sm text-stone-400 mb-2">Supported by:</p>
              <img src={kenariLogoUrl} alt="Logo Kenari Office" className="h-16" />
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
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-lg font-semibold">{t('footer.mainServices')}</span>
            <div className="space-y-2">
              <p className="text-stone-300">{t('footer.civilLaw')}</p>
              <p className="text-stone-300">{t('footer.criminalLaw')}</p>
              <p className="text-stone-300">{t('footer.businessLaw')}</p>
              <p className="text-stone-300">{t('footer.familyLaw')}</p>
              <p className="text-stone-300">{t('footer.propertyLaw')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-lg font-semibold">{t('footer.contact')}</span>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-stone-300 text-sm">Jl. Padang Galak No.46, Kesiman Petilan, Denpasar Timur, Kota Denpasar, Bali 80237</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="text-stone-300">+62 853 5353 6667</p>
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
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/syarat-ketentuan" className="text-stone-400 hover:text-white text-sm transition-colors">
              {t('footer.terms')}
            </Link>
            <span className="text-stone-400 text-sm cursor-pointer hover:text-white transition-colors">{t('footer.privacy')}</span>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;