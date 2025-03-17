import { Box } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "~/components/Header";
import { HeaderButton } from "~/components/Header/types";
import { FORMULAIRE } from "~/core/constants";
import { ButtonVariant } from "~/core/style/themeProps";

export const HomeView: FC = () => {
  const { t } = useTranslation(FORMULAIRE);

  const createButtonAction = () => {
    console.log("call modal creation here");
  };

  const importButtonAction = () => {
    console.log("call modal import here");
  };

  const buttons: HeaderButton[] = [
    {
      title: "formulaire.form.import.button",
      variant: ButtonVariant.OUTLINED,
      action: () => importButtonAction(),
    },
    {
      title: "formulaire.form.create.button",
      variant: ButtonVariant.CONTAINED,
      action: () => createButtonAction(),
    },
  ];

  return (
    <Box>
      <Header stringItems={[t("formulaire.title")]} buttons={buttons}></Header>
    </Box>
  );
};
