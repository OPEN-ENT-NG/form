import { FC, useState } from "react";
import { Box, SearchInput, Typography } from "@cgi-learning-hub/ui";
import { emptyStateWrapperStyle, mainContentInnerStyle, resourceContainerStyle, searchBarStyle, searchStyle } from "~/containers/HomeMainLayout/style";
import { HomeTabs } from "../HomeTab";
import { useHome } from "~/providers/HomeProvider";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useEdificeClient } from "@edifice.io/react";
import { IFormChipProps, IMenuItemProps } from "../OrganizeFilter/types";
import { useSearchAndOrganize } from "~/containers/HomeMainLayout/useSearchAndOrganize";
import { SwitchView } from "../SwitchView";
import { OrganizeFilter } from "../OrganizeFilter";
import { IToggleButtonItem } from "../SwitchView/types";
import { getEmptyStateDescription, useToggleButtons } from "~/containers/HomeMainLayout/utils";
import { sentFormMenuItemDatas, sentFormsChipDatas } from "./utils";
import { ViewMode } from "../SwitchView/enums";
import { HomeMainSentForms } from "~/containers/HomeMainSentForms";
import { HomeMainSentFormTable } from "~/containers/HomeMainSentFormTable";
import { ResourcesEmptyState } from "../SVG/RessourcesEmptyState";
import { useTheme } from "@mui/material";

export const AnswerMainLayout: FC = () => {
  const { user } = useEdificeClient();
  const userId = user?.userId;
  const { folders, forms, currentFolder, tab, tabViewPref, distributions, sentForms, toggleTab, toggleTagViewPref } =
    useHome();
  const viewMode = tabViewPref[tab];
  const theme = useTheme();
  const toggleButtonList: IToggleButtonItem[] = useToggleButtons();
  const [selectedChips, setSelectedChips] = useState<IFormChipProps[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<IMenuItemProps>();

  const { handleSearch, filteredSentForms } = useSearchAndOrganize(
    folders,
    forms,
    currentFolder,
    userId,
    selectedChips,
    sentForms,
    distributions,
    selectedMenuItem,
  );

  const { t } = useTranslation(FORMULAIRE);
  return (
    <Box sx={mainContentInnerStyle}>
      <Box sx={searchStyle}>
        <Box flexShrink={0}>
          <HomeTabs value={tab} setValue={toggleTab} />
        </Box>
        <SearchInput
          placeholder={t("formulaire.search.placeholder")}
          sx={searchBarStyle}
          onChange={(event) => {
            handleSearch(event.target.value);
          }}
        />
        <SwitchView viewMode={viewMode} toggleButtonList={toggleButtonList} onChange={toggleTagViewPref} />
        <OrganizeFilter
          chipDatas={sentFormsChipDatas}
          menuItemDatas={sentFormMenuItemDatas}
          setSelectedChips={setSelectedChips}
          selectedChips={selectedChips}
          setSelectedMenuItem={setSelectedMenuItem}
          selectedMenuItem={selectedMenuItem}
        />
      </Box>
      {filteredSentForms.length > 0 ? (
        <Box sx={resourceContainerStyle}>
          {viewMode === ViewMode.CARDS ? (
            <HomeMainSentForms sentForms={filteredSentForms} distributions={distributions} />
          ) : (
            <HomeMainSentFormTable sentForms={filteredSentForms} distributions={distributions} />
          )}
        </Box>
      ) : (
        <Box sx={emptyStateWrapperStyle}>
          <ResourcesEmptyState fill={theme.palette.primary.main} />
          <Typography>{t(getEmptyStateDescription(currentFolder))}</Typography>
        </Box>
      )}
    </Box>
  );
};
