import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { centerBoxStyle, columnBoxStyle } from "~/core/style/boxStyles";

export const descriptionLayoutStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  ...centerBoxStyle,
  rowGap: "3rem",
  paddingX: "10%",
};

export const descriptionStackStyle: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 1,
  marginBottom: 2,
  padding: "3rem",
  boxShadow: "1px 4px 5px 2px rgba(0, 0, 0, 0.1)",
  rowGap: "2rem",
};
