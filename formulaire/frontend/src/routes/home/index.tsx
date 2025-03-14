import { FC } from "react";
import { HomeView } from "~/containers/HomeView/HomeView";
import { HomeProvider } from "~/providers/HomeProvider";

export const Home: FC = () => {
  return (
    <HomeProvider>
      <HomeView />
    </HomeProvider>
  );
};
