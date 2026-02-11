import { Box } from "@cgi-learning-hub/ui";
import { FC } from "react";

import { AnswerMainLayout } from "~/containers/home/AnswerMainLayout";
import { useGlobal } from "~/providers/GlobalProvider";
import { useHome } from "~/providers/HomeProvider";
import { HomeTabState } from "~/providers/HomeProvider/enums";

import { HomeMainLayout } from "../HomeMainLayout";
import { HomeMainLayoutMobile } from "../HomeMainLayoutMobile";
import { HomeSidebar } from "../HomeSidebar";
import { mainContentStyle, sidebarContentStyle, sidebarStyle, StyledHomeLayoutWrapper } from "./styles";
import { IHomeLayoutProps } from "./types";

export const HomeLayout: FC<IHomeLayoutProps> = ({ headerHeight }) => {
  const { isMobile } = useGlobal();
  const { tab } = useHome();

  const myFormsMobileLayout = <HomeMainLayoutMobile></HomeMainLayoutMobile>;

  const myFormsLayout = (
    <>
      <Box sx={sidebarStyle}>
        <Box sx={sidebarContentStyle}>
          <HomeSidebar />
        </Box>
      </Box>
      <Box sx={mainContentStyle}>
        <HomeMainLayout />
      </Box>
    </>
  );

  const myAnswersLayout = (
    <Box sx={mainContentStyle}>
      <AnswerMainLayout />
    </Box>
  );

  const selectLayout = () => {
    if (tab === HomeTabState.FORMS) {
      if (isMobile) return myFormsMobileLayout;
      return myFormsLayout;
    }
    return myAnswersLayout;
  };

  return <StyledHomeLayoutWrapper headerHeight={headerHeight}>{selectLayout()}</StyledHomeLayoutWrapper>;
};
