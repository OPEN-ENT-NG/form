import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";
import {
  centerBoxStyle,
  columnBoxStyle,
  flexEndBoxStyle,
  flexStartBoxStyle,
  spaceBetweenBoxStyle,
} from "~/core/style/boxStyles";
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
  if (isFirstElement === isLastElement) return { ...spaceBetweenBoxStyle };
  if (isFirstElement) return { ...flexEndBoxStyle };
  return { ...flexStartBoxStyle };
});
