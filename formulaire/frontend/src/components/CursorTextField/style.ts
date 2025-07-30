import { SxProps, Theme } from "@mui/material";

export const cursorTextFieldStyle: SxProps<Theme> = {
  "& input[type='number']::-webkit-inner-spin-button": {
    position: "absolute",
    width: "12.5%",
    height: "100%",
    top: 0,
    right: 0,
  },
};
