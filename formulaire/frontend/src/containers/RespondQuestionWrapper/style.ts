import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { defaultPaperShadow } from "~/core/constants";
import { columnBoxStyle } from "~/core/style/boxStyles";

export const questionStackStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  borderRadius: 1,
  marginBottom: 2,
  padding: "3rem",
  boxShadow: defaultPaperShadow,
  rowGap: "2rem",
};

export const mandatoryTitleStyle: SxProps<Theme> = {
  marginLeft: "0.5rem",
};
