// EXAMPLE: How to Add Translations to Your Components
// Copy this pattern to any component you want to make bilingual

import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationExample = () => {
  // Step 1: Import and use the translation hook
  const { t } = useTranslation();

  return (
    <div className="p-6">
      {/* Step 2: Replace hardcoded text with t() function */}
      
      {/* BEFORE: */}
      {/* <h1>Welcome to KisanConnect</h1> */}
      
      {/* AFTER: */}
      <h1>{t('common.welcome')}</h1>
      
      {/* More Examples: */}
      <button>{t('common.submit')}</button>
      <button>{t('common.cancel')}</button>
      
      {/* Farmer Section */}
      <h2>{t('farmer.dashboard')}</h2>
      <p>{t('farmer.myCrops')}</p>
      <button>{t('farmer.addCrop')}</button>
      
      {/* Buyer Section */}
      <h2>{t('buyer.dashboard')}</h2>
      <p>{t('buyer.browseCrops')}</p>
      
      {/* Wallet */}
      <p>{t('wallet.balance')}: ₹10,000</p>
      <button>{t('wallet.addMoney')}</button>
      
      {/* Rating */}
      <h3>{t('rating.title')}</h3>
      <p>{t('rating.averageRating')}: 4.5</p>
      
      {/* Dynamic Content with Variables (Advanced) */}
      <p>{t('auth.name')}: John Doe</p>
      <p>{t('farmer.quantity')}: 100 kg</p>
    </div>
  );
};

export default TranslationExample;

/* 
  HOW IT WORKS:
  
  1. When language is English:
     t('common.welcome') returns "Welcome"
  
  2. When language is Hindi:
     t('common.welcome') returns "स्वागत है"
  
  3. The LanguageSwitcher component in navbar controls which language is active
  
  4. Language preference is saved in localStorage and persists across sessions
  
  5. All translation keys are defined in:
     - src/i18n/locales/en.json (English)
     - src/i18n/locales/hi.json (Hindi)
     
  WHEN ADDING NEW FEATURES:
  
  1. Add translation keys to both en.json and hi.json
  2. Use t('section.key') in your component
  3. Test in both languages using the language switcher
*/
