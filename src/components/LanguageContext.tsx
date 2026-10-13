'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_home: 'Home',
    nav_dashboard: 'Risk Dashboard',
    nav_map: 'Flood Map',
    nav_warnings: 'Early Warnings',
    nav_shelters: 'Shelter Finder',
    nav_resources: 'Relief Supplies',
    nav_route: 'Safe Route',
    nav_sos: 'EMERGENCY SOS',
    nav_family: 'Family Safety',
    nav_offline: 'Offline Mode',
    nav_checklist: 'Kit Checklist',
    nav_admin: 'Command Center',
    btn_sos: 'EMERGENCY SOS',
    btn_login: 'Sign In',
    btn_logout: 'Sign Out',
    tagline: 'Warn Early. Navigate Safely. Survive Smarter.',
    disclaimer_notice: 'Demonstration Mode: Uses verified sample data. In a life-threatening flood, immediately dial 112 or 1077.',
    helpline_112: '112 (National Emergency)',
    helpline_1077: '1077 (Disaster Control)',
    helpline_108: '108 (Ambulance)',
    shelter_recommendation: 'Recommended Evacuation Shelter',
  },
  hi: {
    nav_home: 'होम',
    nav_dashboard: 'बाढ़ जोखिम डैशबोर्ड',
    nav_map: 'बाढ़ मानचित्र',
    nav_warnings: 'पूर्व चेतावनी',
    nav_shelters: 'सुरक्षित आश्रय स्थल',
    nav_resources: 'राहत सामग्री',
    nav_route: 'सुरक्षित मार्ग',
    nav_sos: 'आपातकालीन एसओएस',
    nav_family: 'परिवार सुरक्षा',
    nav_offline: 'ऑफलाइन मोड',
    nav_checklist: 'तैयारी चेकलिस्ट',
    nav_admin: 'कमांड सेंटर',
    btn_sos: 'आपातकालीन एसओएस',
    btn_login: 'लॉग इन करें',
    btn_logout: 'लॉग आउट',
    tagline: 'पूर्व चेतावनी। सुरक्षित मार्ग। समझदारी से बचाव।',
    disclaimer_notice: 'डेमो मोड: केवल नमूना डेटा का उपयोग। जीवन-संकट के समय तुरंत 112 या 1077 पर कॉल करें।',
    helpline_112: '112 (राष्ट्रीय आपातकाल)',
    helpline_1077: '1077 (आपदा नियंत्रण कक्ष)',
    helpline_108: '108 (एम्बुलेंस सेवा)',
    shelter_recommendation: 'अनुशंसित सुरक्षित आश्रय',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('aapdasetu_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aapdasetu_lang', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;

