import { FC, forwardRef, PropsWithChildren, Ref } from "react";

export const EdificeClientProvider: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

export function useEdificeClient() {
  return {
    appCode: "formulaire",
  };
}

export const EdificeThemeProvider: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

// Also handle `/multimedia`
export const MediaLibrary = forwardRef<HTMLDivElement>(() => null);
export type MediaLibraryRef = Ref<HTMLDivElement>;
