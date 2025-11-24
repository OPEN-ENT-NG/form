import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { defaultPaperShadow } from "~/core/constants";
import { centerBoxStyle, columnBoxStyle } from "~/core/style/boxStyles";

export const endPreviewLayoutStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  ...centerBoxStyle,
  paddingX: "10%",
};

export const endPreviewStackStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  ...centerBoxStyle,
  borderRadius: 1,
  padding: "3rem",
  boxShadow: defaultPaperShadow,
  rowGap: "2rem",
};
