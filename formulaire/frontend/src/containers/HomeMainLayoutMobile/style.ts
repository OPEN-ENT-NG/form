import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { flexStartBoxStyle, spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const mainContentInnerStyle: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "1rem",
};

export const treeViewButtonStyle: SxProps<Theme> = {
  ...flexStartBoxStyle,
  padding: "0 calc(1px + 1rem)",
};

export const searchStyle: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
  height: "3.5rem",
  padding: "0 calc(1px + 1rem)",
};

export const searchBarStyle: SxProps<Theme> = {
  padding: 0,
  width: "100%",
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

export const emptyStateWrapperStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
};

export const subTextStyle: SxProps<Theme> = {
  textAlign: "center",
};
