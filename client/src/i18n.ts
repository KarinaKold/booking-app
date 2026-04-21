import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { locales, defaultLocale } from './locale';

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: locales.en },
			ru: { translation: locales.ru },
		},
		fallbackLng: defaultLocale,
		detection: {
			order: ['localStorage', 'cookie', 'htmlTag'],
			caches: ['localStorage'],
		},
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
