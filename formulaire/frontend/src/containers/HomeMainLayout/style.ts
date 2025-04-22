import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const mainContentInnerStyle: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  justifyContent: "flex-start",

  flexDirection: "column",
  gap: "3rem",
  paddingTop: "2rem",
};

export const searchStyle: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
  height: "3.5rem",
  padding: "0 5rem 0 3rem",
};

export const viewTitleStyle: SxProps<Theme> = {
  ...searchStyle,
  paddingTop: "1rem",
};

export const resourceContainerStyle: SxProps<Theme> = {
  overflowY: "auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: " 1rem 3rem 0 3rem",
  width: "100%",
  gap: "4rem",
};

export const searchBarStyle: SxProps<Theme> = {
  width: "100%",
};

export const emptyStateWrapperStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
};
