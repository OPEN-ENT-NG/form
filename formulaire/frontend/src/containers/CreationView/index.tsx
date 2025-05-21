import { FC } from "react";

import { Box } from "@cgi-learning-hub/ui";
import { Header } from "~/components/Header";
import { useElementHeight } from "../HomeView/utils";
import { useCreation } from "~/providers/CreationProvider";
import { useGetCreationHeaderButtons } from "./utils";
import { CreationLayout } from "../CreationLayout";

export const CreationView: FC = () => {
  const { form } = useCreation();
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>();
  const headerButtons = useGetCreationHeaderButtons();

  return (
    <Box height="100%">
      <Box ref={headerRef}>
        {form ? (
          <Header stringItems={[form.title]} buttons={headerButtons} />
        ) : (
          <Header stringItems={["test"]} buttons={headerButtons} />
        )}
      </Box>

      {form && <CreationLayout headerHeight={headerHeight} />}
    </Box>
  );
};
