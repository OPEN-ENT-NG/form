import { SxProps, Theme } from "@mui/material";

export const outerContainerStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

export const innerContainerStyle: SxProps<Theme> = {
  width: "65%",
  display: "flex",
  flexDirection: "column",
  marginTop: 4,
};

export const elementBoxStyle: SxProps<Theme> = {
  width: "100%",
  height: 64,
  bgcolor: "grey.100",
  mb: 2,
  borderRadius: 1,
};
