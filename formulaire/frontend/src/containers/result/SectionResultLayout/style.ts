import { SxProps } from "@mui/material";

import { DIVIDER_COLOR, SECONDARY_MAIN_COLOR } from "~/core/style/colors";

export const sectionTitleStyle: SxProps = {
  backgroundColor: SECONDARY_MAIN_COLOR,
  width: "100%",
  padding: "3rem",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
};

export const sectionContentStyle: SxProps = {
  borderBottomLeftRadius: "4px",
  borderBottomRightRadius: "4px",
  borderColor: DIVIDER_COLOR,
  borderWidth: "1px",
  borderStyle: "solid",
  borderTop: "unset",
  padding: "4rem",
  gap: "2rem",
};
