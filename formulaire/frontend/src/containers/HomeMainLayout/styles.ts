import { SxProps, Theme } from "@mui/material";

export const containerStyle: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  height: "calc(100vh - 71px)",
  boxSizing: "border-box",
  borderTop: "1px solid #ccc",
  overflow: "hidden",
};

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
};
