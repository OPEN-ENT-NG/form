import { SxProps, Theme } from "@cgi-learning-hub/ui";

import { defaultPaperShadow } from "~/core/constants";
import { centerBoxStyle, columnBoxStyle } from "~/core/style/boxStyles";

export const descriptionLayoutStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  ...centerBoxStyle,
  rowGap: "3rem",
  paddingX: "10%",
};

export const descriptionStackStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  borderRadius: 1,
  marginBottom: 2,
  padding: "3rem",
  boxShadow: defaultPaperShadow,
  rowGap: "2rem",
};
