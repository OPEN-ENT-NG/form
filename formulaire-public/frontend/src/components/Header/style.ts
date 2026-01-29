import { SxProps, Theme } from "@cgi-learning-hub/ui";

import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const headerStyle: SxProps<Theme> = {
  ...spaceBetweenBoxStyle,
  padding: "3rem 5rem 3rem 2rem",
  display: "flex",
};

export const headerButtonsStyle: SxProps<Theme> = {
  height: "3.6rem",
  display: "flex",
  flexShrink: { xs: 1, md: 1, lg: 0 },
  flexWrap: { xs: "wrap", md: "wrap", lg: "nowrap" },
  alignItems: "center",
  justifyContent: "end",
};
