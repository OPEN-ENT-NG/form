import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";

import { centerBoxStyle, columnBoxStyle, flexEndBoxStyle, spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { blockProps } from "~/core/utils";

import { IButtonsWrapperProps } from "./types";

export const responseLayoutStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  ...centerBoxStyle,
  rowGap: "3rem",
  paddingX: "10%",
};

export const StyledButtonsWrapper = styled(Box, {
  shouldForwardProp: blockProps("displayPrev"),
})<IButtonsWrapperProps>(({ displayPrev = false }) => {
  return !displayPrev ? { ...flexEndBoxStyle } : { ...spaceBetweenBoxStyle };
});
