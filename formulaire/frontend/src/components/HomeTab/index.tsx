import { FC } from "react";
import { Tab, Tabs } from "@cgi-learning-hub/ui";
import { IHomeTabsProps } from "./types";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";
import { tabStyle } from "./style";

export const HomeTabs: FC<IHomeTabsProps> = ({ value, setValue }) => {
  const { userWorkflowRights } = useHome();
  const { t } = useTranslation(FORMULAIRE);

  const handleChange = (_: React.SyntheticEvent, newValue: HomeTabState) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      {userWorkflowRights.CREATION && <Tab value={HomeTabState.FORMS} label={t("formulaire.tab.list")} sx={tabStyle} />}
      {userWorkflowRights.RESPONSE && (
        <Tab value={HomeTabState.RESPONSES} label={t("formulaire.tab.responses")} sx={tabStyle} />
      )}
    </Tabs>
  );
};
