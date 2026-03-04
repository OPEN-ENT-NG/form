import { FC } from "react";

import { HomeView } from "~/containers/home/HomeView";
import { ShareModalProvider } from "~/providers/ShareModalProvider";

export const Home: FC = () => {
  return (
    <ShareModalProvider>
      <HomeView />
    </ShareModalProvider>
  );
};
