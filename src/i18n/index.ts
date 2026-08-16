import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ta from "./locales/ta.json";

export const SUPPORTED_LANGUAGES = [
  { code: "ta", label: "தமிழ்" },
  { code: "en", label: "English" },
] as const;

export const LANGUAGE_STORAGE_KEY = "smkt.lang";

function initialLanguage() {
  if (typeof window === "undefined") return "ta";
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? "ta";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, ta: { translation: ta } },
    lng: initialLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export function changeLanguage(code: string) {
  void i18n.changeLanguage(code);
  if (typeof window !== "undefined") window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
}

export default i18n;
