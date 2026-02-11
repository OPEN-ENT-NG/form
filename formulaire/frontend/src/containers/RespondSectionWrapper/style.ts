import { SxProps, Theme } from "@cgi-learning-hub/ui";

import { columnBoxStyle } from "~/core/style/boxStyles";
import { SECONDARY_MAIN_COLOR } from "~/core/style/colors";
import { CSS_DIVIDER_COLOR } from "~/core/style/cssColors";

export const sectionStackStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  border: `1px solid ${CSS_DIVIDER_COLOR}`,
  borderTop: "none",
  borderRadius: 1,
  backgroundColor: "transparent",
  marginBottom: 2,
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
