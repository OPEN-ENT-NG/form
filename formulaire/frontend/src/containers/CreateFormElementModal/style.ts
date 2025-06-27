import { SxProps, Theme } from "@mui/material";

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
  justifyContent: "center",
};

export const questionIconStyle: SxProps<Theme> = {
  width: "3.6rem",
  height: "3.6rem",
};
