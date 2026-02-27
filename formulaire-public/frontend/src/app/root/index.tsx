import { Layout, useEdificeClient } from "@edifice.io/react";
import { Outlet } from "react-router-dom";
function Root() {
  useEdificeClient();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Root;
