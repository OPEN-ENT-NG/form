import "../mocks/uiMocks";
import "@testing-library/jest-dom";
// Mocking the react-i18next so we can use raw keys in our tests
// This is a simple mock that returns the key itself as the translation
jest.mock("react-i18next", () => ({
  // satisfy i18next.use(plugin)
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));
