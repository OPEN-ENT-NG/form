import { FC, useState } from "react";
import { Box, SearchInput, Typography } from "@cgi-learning-hub/ui";
import {
  emptyStateWrapperStyle,
  resourceContainerStyle,
  searchBarStyle,
  StyledMainContentInnerWrapper,
} from "~/containers/HomeMainLayout/style";
import { HomeTabs } from "../../components/HomeTab";
import { useHome } from "~/providers/HomeProvider";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useEdificeClient } from "@edifice.io/react";
import { IFormChipProps, IMenuItemProps } from "../../components/OrganizeFilter/types";
import { useSearchAndOrganize } from "~/containers/HomeMainLayout/useSearchAndOrganize";
import { SwitchView } from "../../components/SwitchView";
import { OrganizeFilter } from "../../components/OrganizeFilter";
import { IToggleButtonItem } from "../../components/SwitchView/types";
import { useToggleButtons } from "~/containers/HomeMainLayout/utils";
import { sentFormMenuItemDatas, sentFormsChipDatas } from "./utils";
import { ViewMode } from "../../components/SwitchView/enums";
import { HomeMainSentForms } from "~/containers/HomeMainSentForms";
import { HomeMainSentFormTable } from "~/containers/HomeMainSentFormTable";
import { ResourcesEmptyState } from "../../components/SVG/RessourcesEmptyState";
import { useTheme } from "@mui/material";
import { centerBoxStyle } from "~/core/style/boxStyles";
import { myAnswerSearchStyle, StyledMyAnswerHeaderWrapper, tabStyle } from "./style";
import { useGlobal } from "~/providers/GlobalProvider";

export const AnswerMainLayout: FC = () => {
  const { user } = useEdificeClient();
  const userId = user?.userId;
  const { isMobile } = useGlobal();
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
    tab,
    selectedMenuItem,
  );

  const { t } = useTranslation(FORMULAIRE);
  return (
    <StyledMainContentInnerWrapper isMobile={isMobile}>
      <StyledMyAnswerHeaderWrapper isMobile={isMobile}>
        <Box sx={tabStyle}>
          <HomeTabs value={tab} setValue={toggleTab} />
        </Box>
        <Box sx={myAnswerSearchStyle}>
          {!isMobile && (
            <>
              <SearchInput
                placeholder={t("formulaire.search.placeholder")}
                sx={searchBarStyle}
                onChange={(event) => {
                  handleSearch(event.target.value);
                }}
              />
              <SwitchView viewMode={viewMode} toggleButtonList={toggleButtonList} onChange={toggleTagViewPref} />
            </>
          )}
          <OrganizeFilter
            chipDatas={sentFormsChipDatas}
            menuItemDatas={sentFormMenuItemDatas}
            setSelectedChips={setSelectedChips}
            selectedChips={selectedChips}
            setSelectedMenuItem={setSelectedMenuItem}
            selectedMenuItem={selectedMenuItem}
            forceUniqueChips={true}
          />
        </Box>
      </StyledMyAnswerHeaderWrapper>
      {filteredSentForms.length > 0 ? (
        <Box sx={resourceContainerStyle}>
          {viewMode === ViewMode.CARDS ? (
            <HomeMainSentForms sentForms={filteredSentForms} distributions={distributions} />
          ) : (
            <HomeMainSentFormTable sentForms={filteredSentForms} distributions={distributions} />
          )}
        </Box>
      ) : (
        <Box sx={centerBoxStyle} height="100%">
          <Box sx={emptyStateWrapperStyle}>
            <Box height="25rem">
              <ResourcesEmptyState fill={theme.palette.primary.main} />
            </Box>
            <Typography>{t("formulaire.responses.empty.notif")}</Typography>
          </Box>
        </Box>
      )}
    </StyledMainContentInnerWrapper>
  );
};
