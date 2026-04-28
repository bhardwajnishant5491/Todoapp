import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const currentLanguage = i18n.language;
  const isHindi = currentLanguage === 'hi';

  return (
    <motion.button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all hover:bg-gray-100 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
    >
      <FiGlobe className="w-5 h-5" />
      <span className="text-sm font-semibold">
        {isHindi ? 'हिंदी' : 'English'}
      </span>
      <div className="flex items-center gap-1 text-xs bg-gray-200 px-2 py-0.5 rounded">
        <span className={!isHindi ? 'font-bold text-blue-600' : 'text-gray-500'}>EN</span>
        <span className="text-gray-400">|</span>
        <span className={isHindi ? 'font-bold text-blue-600' : 'text-gray-500'}>हिं</span>
      </div>
    </motion.button>
  );
};

export default LanguageSwitcher;
