import { FC } from "react";
import { Tab, Tabs } from "@cgi-learning-hub/ui";
import { HomeTabsProps } from "./types";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";

export const HomeTabs: FC<HomeTabsProps> = ({ value, setValue }) => {
  const { t } = useTranslation(FORMULAIRE);
  const handleChange = (_: React.SyntheticEvent, newValue: HomeTabState) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab value={HomeTabState.FORMS} label={t("formulaire.tab.list")} />
      <Tab value={HomeTabState.RESPONSES} label={t("formulaire.tab.responses")} />
    </Tabs>
  );
};
