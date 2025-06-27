import { SxProps, Theme } from "@mui/material";

export const cursorPropsStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  rowGap: 3,
};

export const cursorLineStyle: SxProps<Theme> = {
  display: "flex",
  columnGap: 5,
  flexWrap: "wrap",
};

export const cursorColumnStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
};

export const cursorItemStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyItems: "flex-end",
  gap: 1,
  "> :first-child": {
    textWrapMode: "nowrap",
  },
};

export const cursorValueNameStyle: SxProps<Theme> = {
  display: "flex",
  width: "150px",
  textWrapMode: "nowrap",
};
