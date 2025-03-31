import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const mainContentInnerStyle: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  justifyContent: "flex-start",

  flexDirection: "column",
  gap: "2rem",
  padding: "2rem 2rem 0 2rem",
};

export const searchStyle: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
  height: "3.5rem",
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

export const homeTabsStyle: SxProps<Theme> = {
  flexShrink: 0,  
};

export const searchBarStyle: SxProps<Theme> = {
  width: "100%",
};

export const emptyStateWrapperStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: "2rem",
  gap: "2rem",
  height: "calc(100% - 7rem - 4rem - 4rem)",
  maxHeight: "40rem",
};
