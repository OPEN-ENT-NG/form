import { Layout, LoadingScreen, useEdificeClient } from "@edifice.io/react";
import { Outlet } from "react-router-dom";

import { HomeProvider } from "~/providers/HomeProvider";
function Root() {
  const { init } = useEdificeClient();

  if (!init) return <LoadingScreen position={false} />;

  return (
    <Layout>
      <HomeProvider>
        <Outlet />
      </HomeProvider>
    </Layout>
  );
}

export default Root;
