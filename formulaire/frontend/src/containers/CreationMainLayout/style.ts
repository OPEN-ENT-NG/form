import { SxProps, Theme } from "@mui/material";

export const outerContainerStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  overflow: "auto",
};

export const innerContainerStyle: SxProps<Theme> = {
  width: "65%",
  display: "flex",
  flexDirection: "column",
  marginTop: 4,
};

export const elementListStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

export const actionButtonStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
};
