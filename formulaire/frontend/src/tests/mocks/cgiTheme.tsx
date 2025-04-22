// src/tests/mocks/cgi-theme.tsx
import { FC, PropsWithChildren } from "react";

/**
 * Match the real ThemeProviderProps shape enough for tests.
 */
export type ThemeProviderProps = {
  themeId?: string;
  options?: any;
};

/**
 * A no-op ThemeProvider so tests can import and render without pulling in the real implementation.
 */
export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({ children }) => <>{children}</>;
