import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";
import { HomeLayoutWrapperProps } from "./types";
import { CSS_DIVIDER_COLOR } from "~/core/style/cssColors";

export const HomeLayoutWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "headerHeight",
})<HomeLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: "100%",
  height: `calc(100% - ${headerHeight}px)`,
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
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const mainContentStyle: SxProps<Theme> = {
  flexGrow: 1,
  height: "100%",
  boxSizing: "border-box",
};
