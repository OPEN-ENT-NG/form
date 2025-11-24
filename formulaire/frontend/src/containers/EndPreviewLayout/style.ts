import { SxProps, Theme } from "@cgi-learning-hub/ui";
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
  boxShadow: "1px 4px 5px 2px rgba(0, 0, 0, 0.1)",
  rowGap: "2rem",
};
