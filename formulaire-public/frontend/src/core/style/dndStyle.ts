import { SxProps } from "@mui/material";

import { CSS_GREY_MAIN_COLOR } from "~/core/style/cssColors.ts";

export const cardPreviewStyle: SxProps = {
  opacity: 0.5,
  width: "30rem",
};

export const overedStyle: SxProps = {
  "& .MuiPaper-root": {
    border: `2px solid ${CSS_GREY_MAIN_COLOR}`,
  },
};

export const dragActiveStyle: SxProps = {
  opacity: 0.5,
};
