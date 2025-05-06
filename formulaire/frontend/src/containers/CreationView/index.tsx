import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";

import { Box } from "@cgi-learning-hub/ui";
import { Header } from "~/components/Header";
import { useElementHeight } from "../HomeView/utils";

export const CreationView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);

  const [headerRef] = useElementHeight<HTMLDivElement>();

  return (
    <Box height={"100%"}>
      <Box ref={headerRef}>
        <Header stringItems={[t("formulaire.title")]} buttons={[]} />
      </Box>
    </Box>
  );
};
