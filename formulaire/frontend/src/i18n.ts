/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { COMMON, FORMULAIRE } from "./core/constants";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: (_lngs: string[], namespaces: string[]) => {
        const urls = namespaces.map((namespace: string) => {
          if (namespace === COMMON) {
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
    defaultNS: COMMON,
    // you can add name of the app directly in the ns array
    ns: [COMMON, FORMULAIRE],
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    interpolation: {
      escapeValue: false,
      prefix: "{{",
      suffix: "}}",
    },
    debug: false,
  });

export const t = (key: string, options?: Record<string, unknown>) => {
  return i18n.t(key, { ns: FORMULAIRE, ...options });
};

export default i18n;
