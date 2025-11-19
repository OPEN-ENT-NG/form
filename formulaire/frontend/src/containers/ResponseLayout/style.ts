import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";
import { centerBoxStyle, columnBoxStyle, flexEndBoxStyle, spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { IButtonsWrapperProps } from "./types";
import { blockProps } from "~/core/utils";

export const responseLayoutStyle: SxProps<Theme> = {
  ...columnBoxStyle,
  ...centerBoxStyle,
  rowGap: "3rem",
  paddingX: "10%",
};

export const StyledButtonsWrapper = styled(Box, {
  shouldForwardProp: blockProps("isFirstElement", "isLastElement"),
})<IButtonsWrapperProps>(({ isFirstElement = false, isLastElement = false }) => {
  if (isLastElement || isFirstElement === isLastElement) return { ...spaceBetweenBoxStyle };
  return { ...flexEndBoxStyle };
});
