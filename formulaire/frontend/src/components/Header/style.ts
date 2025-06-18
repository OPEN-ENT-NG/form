import { SxProps } from "@mui/material";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const headerStyle: SxProps = {
  ...spaceBetweenBoxStyle,
  padding: "3rem 5rem 3rem 2rem",
};

export const headerButtonsStyle: SxProps = {
  height: "3.6rem",
  display: "flex",
  flexShrink: { xs: 1, md: 1, lg: 0 },
  flexWrap: { xs: "wrap", md: "wrap", lg: "nowrap" },
  alignItems: "center",
};
