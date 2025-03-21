import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

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
