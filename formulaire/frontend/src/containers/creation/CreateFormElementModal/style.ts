import { SxProps, Theme } from "@mui/material";

import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

export const createFormElementModalPaperStyle: SxProps<Theme> = {
  height: "fit-content",
  maxWidth: "70rem",
};

export const createFormElementModalContentStyle: SxProps<Theme> = {
  paddingX: 12,
};

export const sectionButtonStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 2,
  padding: 2,
};

export const questionStyle: SxProps<Theme> = {
  marginBottom: "3rem !important",
};

export const questionButtonStyle: SxProps<Theme> = {
  width: "11rem",
  height: "11rem",
  position: "relative",
};

export const questionGridStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
};

export const questionStackStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  flexDirection: "column",
  height: "100%",
  position: "relative",
};

export const questionTextStyle: SxProps<Theme> = {
  marginTop: "1rem !important",
};

export const iconContainerStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  color: TEXT_PRIMARY_COLOR,
};

export const questionIconStyle: SxProps<Theme> = {
  color: TEXT_PRIMARY_COLOR,
  height: "3rem",
  width: "3rem",
};
