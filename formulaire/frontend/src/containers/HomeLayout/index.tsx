import { FC } from "react";
import { Box } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";
import { sidebarStyle, sidebarContentStyle, mainContentStyle, StyledHomeLayoutWrapper } from "./styles";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { HomeSidebar } from "../HomeSidebar";
import { IHomeLayoutProps } from "./types";
import { HomeMainLayout } from "../HomeMainLayout";
import { AnswerMainLayout } from "~/containers/AnswerMainLayout";
import { HomeMainLayoutMobile } from "../HomeMainLayoutMobile";

export const HomeLayout: FC<IHomeLayoutProps> = ({ headerHeight }) => {
  const { isMobile, tab } = useHome();

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
