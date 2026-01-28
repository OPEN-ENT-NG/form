import { SxProps, Theme } from "@cgi-learning-hub/ui";

import { defaultViewBackgroundColor } from "~/core/constants";

export const homeViewStyle: SxProps<Theme> = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: defaultViewBackgroundColor,
};
