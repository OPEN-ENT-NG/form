import { FC, PropsWithChildren } from "react";

// No‑op wrappers for tests:
export const EdificeClientProvider: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

export const EdificeThemeProvider: FC<PropsWithChildren> = ({ children }) => <>{children}</>;
