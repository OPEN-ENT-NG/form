import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";

import { CSS_DIVIDER_COLOR } from "~/core/style/cssColors";
import { blockProps } from "~/core/utils";

import { IHomeLayoutWrapperProps } from "./types";

export const StyledHomeLayoutWrapper = styled(Box, {
  shouldForwardProp: blockProps("headerHeight"),
})<IHomeLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: "100%",
  height: `calc(100% - ${headerHeight.toString()}px)`,
  boxSizing: "border-box",
  borderTop: `1px solid ${CSS_DIVIDER_COLOR}`,
  overflow: "hidden",
}));

export const sidebarStyle: SxProps<Theme> = {
  width: 320,
  flexShrink: 0,
  boxSizing: "border-box",
  borderRight: `1px solid ${CSS_DIVIDER_COLOR}`,
  height: "100%",
};

export const sidebarContentStyle: SxProps<Theme> = {
  height: "calc(100vh - 96px - 70px);", // 100vh - header accueil - header plateforme
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

export const mainContentStyle: SxProps<Theme> = {
  flexGrow: 1,
  height: "calc(100vh - 96px - 70px)", // 100vh - header accueil - header plateforme
  boxSizing: "border-box",
  width: "100%",
};
