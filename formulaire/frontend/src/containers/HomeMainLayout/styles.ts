import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";
import { HomeMainLayoutWrapperProps } from "./types";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const HomeMainLayoutWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "headerHeight",
})<HomeMainLayoutWrapperProps>(({ headerHeight = 71 }) => ({
  display: "flex",
  width: "100%",
  height: `calc(100% - ${headerHeight}px)`,
  boxSizing: "border-box",
  borderTop: "1px solid #ccc",
  overflow: "hidden",
}));

export const sidebarStyle: SxProps<Theme> = {
  width: 320,
  flexShrink: 0,
  boxSizing: "border-box",
  borderRight: "1px solid #ccc",
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

export const mainContentInnerStyle: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "2rem",
  padding: "2rem",
};

export const searchStyle: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
};

export const resourceContainerStyle: SxProps<Theme> = {
  overflowY: "auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "1rem ",
  width: "100%",
  gap: "2rem",
};

export const searchBarStyle: SxProps<Theme> = {
  width: "100%",
};
