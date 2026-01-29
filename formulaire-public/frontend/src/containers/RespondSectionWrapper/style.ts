import { SxProps, Theme } from "@cgi-learning-hub/ui";

import { defaultPaperShadow } from "~/core/constants";
import { columnBoxStyle } from "~/core/style/boxStyles";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";

export const sectionStackStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  borderRadius: 1,
  marginBottom: 2,
  boxShadow: defaultPaperShadow,
};

export const sectionHeaderWrapperStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  backgroundColor: SECONDARY_MAIN_COLOR,
  borderRadius: 1,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  padding: "2rem 3.2rem 1.6rem",
};

export const descriptionStyle: SxProps<Theme> = {
  marginTop: "2rem",
  marginBottom: "3rem",
};

export const sectionContentStyle: SxProps<Theme> = {
  paddingY: 2,
  paddingX: 4,
};
