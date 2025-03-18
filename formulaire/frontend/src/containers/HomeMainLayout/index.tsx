import { FC } from "react";
import { Box } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";
import {
  sidebarStyle,
  sidebarContentStyle,
  mainContentStyle,
  mainContentInnerStyle,
  HomeMainLayoutWrapper,
} from "./styles";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { HomeSidebar } from "../HomeSidebar";
import { HomeMainLayoutProps } from "./types";

export const HomeMainLayout: FC<HomeMainLayoutProps> = ({ headerHeight }) => {
  const { tab } = useHome();

  return (
    <HomeMainLayoutWrapper headerHeight={headerHeight}>
      {tab === HomeTabState.FORMS && (
        <Box sx={sidebarStyle}>
          <Box sx={sidebarContentStyle}>
            <HomeSidebar />
          </Box>
        </Box>
      )}
      <Box sx={mainContentStyle}>
        <Box sx={mainContentInnerStyle}>TODO</Box>
      </Box>
    </HomeMainLayoutWrapper>
  );
};
