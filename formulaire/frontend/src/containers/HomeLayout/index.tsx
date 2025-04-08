import { FC } from "react";
import { Box } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";
import { sidebarStyle, sidebarContentStyle, mainContentStyle, HomeLayoutWrapper } from "./styles";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { HomeSidebar } from "../HomeSidebar";
import { IHomeLayoutProps } from "./types";
import { HomeMainLayout } from "../HomeMainLayout";

export const HomeLayout: FC<IHomeLayoutProps> = ({ headerHeight }) => {
  const { tab } = useHome();

  return (
    <HomeLayoutWrapper headerHeight={headerHeight}>
      {tab === HomeTabState.FORMS && (
        <Box sx={sidebarStyle}>
          <Box sx={sidebarContentStyle}>
            <HomeSidebar />
          </Box>
        </Box>
      )}
      <Box sx={mainContentStyle}>
        <HomeMainLayout />
      </Box>
    </HomeLayoutWrapper>
  );
};
