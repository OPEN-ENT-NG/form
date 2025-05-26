import { SxProps, Theme } from "@mui/material";

export const createFormElementModalStyle: SxProps<Theme> = {
  marginTop: 0,
};

export const createFormElementModalPaperStyle: SxProps<Theme> = {
  minHeight: "96vh",
  maxWidth: "55vw",
  marginTop: 0,
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

export const questionButtonStyle: SxProps<Theme> = {
  width: "11rem",
  height: "11rem",
  cursor: "pointer",
  position: "relative",
};

export const questionGridStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
};

export const questionIconStyle: SxProps<Theme> = {
  width: "3.6rem",
  height: "3.6rem",
};
