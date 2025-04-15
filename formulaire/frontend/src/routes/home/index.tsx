import { FC } from "react";
import { HomeView } from "~/containers/HomeView";
import { HomeProvider } from "~/providers/HomeProvider";
import { ShareModalProvider } from "~/providers/ShareModalProvider";

export const Home: FC = () => {
  return (
    <HomeProvider>
      <ShareModalProvider>
        <HomeView />
      </ShareModalProvider>
    </HomeProvider>
  );
};
