import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { FORMULAIRE_PUBLIC } from "./core/constants";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: (_lngs: string[], namespaces: string[]) => {
        const urls = namespaces.map((namespace: string) => {
          if (namespace === "common") {
            return `/i18n`;
          }
          return `/${namespace}/i18n`;
        });
        return urls;
      },
      parse: function (data: string) {
        return JSON.parse(data);
      },
    },
    defaultNS: "common",
    // you can add name of the app directly in the ns array
    ns: ["common", FORMULAIRE_PUBLIC],
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    interpolation: {
      escapeValue: false,
      prefix: "{{",
      suffix: "}}",
    },
    debug: false,
  });

export default i18n;
