import "./mocks/uiMocks";
import "@testing-library/jest-dom";
// Mocking the react-i18next so we can use raw keys in our tests
// This is a simple mock that returns the key itself as the translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
