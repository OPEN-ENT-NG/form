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

  return (
    <StyledHomeLayoutWrapper headerHeight={headerHeight}>
      {tab === HomeTabState.FORMS ? (
        isMobile ? (
          // Forms + mobile
          <HomeMainLayoutMobile></HomeMainLayoutMobile>
        ) : (
          // Forms + desktop
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
        )
      ) : (
        // Answers (mobile or not)
        <Box sx={mainContentStyle}>
          <AnswerMainLayout />
        </Box>
      )}
    </StyledHomeLayoutWrapper>
  );
};
