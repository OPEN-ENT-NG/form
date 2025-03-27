import { PRIMARY_LIGHT_COLOR } from "~/core/style/colors";
import { CSS_COMMON_WHITE_COLOR, CSS_PRIMARY_LIGHTER_COLOR, CSS_PRIMARY_MAIN_COLOR, CSS_TEXT_SECONDARY_COLOR } from "~/core/style/cssColors";

export const switchViewStyle = {
  boderColor: PRIMARY_LIGHT_COLOR
};

export const switchViewItemStyle = {
  "&.Mui-selected": {
    backgroundColor: CSS_PRIMARY_MAIN_COLOR,
    color: CSS_COMMON_WHITE_COLOR,
  },
  "&:hover": {
    backgroundColor: CSS_PRIMARY_LIGHTER_COLOR,
    color: CSS_TEXT_SECONDARY_COLOR,
  },
  "&.Mui-selected:hover": {
    backgroundColor: CSS_PRIMARY_MAIN_COLOR,
    color: CSS_COMMON_WHITE_COLOR,
  },
  color: CSS_TEXT_SECONDARY_COLOR,
};
