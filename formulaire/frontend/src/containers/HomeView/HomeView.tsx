import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { FORMULAIRE } from "~/core/constants";
import { Box } from "@cgi-learning-hub/ui";
import { getHomeHeaderButtons } from "./utils";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);
  const headerButtons = getHomeHeaderButtons();

  return (
    <Box>
      <Header
        stringItems={[t("formulaire.title")]}
        buttons={headerButtons}
      ></Header>
    </Box>
  );
};
