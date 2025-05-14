import { SxProps, Theme } from "@mui/material";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const myAnswerHeader: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
  height: "3.5rem",
  padding: "0 5rem 0 0",
};

export const tabStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  width: "319px",
};
