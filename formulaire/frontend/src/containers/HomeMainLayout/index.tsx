import { FC } from "react";
import { Box } from "@mui/material";
import { useHomeProvider } from "~/providers/HomeProvider";
import {
  containerStyle,
  sidebarStyle,
  sidebarContentStyle,
  mainContentStyle,
  mainContentInnerStyle,
} from "./styles";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { HomeSidebar } from "../HomeSidebar";

export const HomeMainLayout: FC = () => {
  const { tab } = useHomeProvider();

  return (
    <Box sx={containerStyle}>
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
    </Box>
  );
};
