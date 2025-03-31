import { SxProps } from "@cgi-learning-hub/ui";
import { CSS_PRIMARY_MAIN_COLOR } from "~/core/style/cssColors";

export const toasterWrapper: SxProps = {
  position: "fixed",
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: "100",
  padding: "1.1rem",
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  background: CSS_PRIMARY_MAIN_COLOR,
};
