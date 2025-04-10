import { Box, styled } from "@cgi-learning-hub/ui";
import { IStyledDraggableFolderProps } from "./types";
import { dragActiveStyle, overedStyle } from "~/core/style/dndStyle";

export const StyledDraggableFolder = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOvered" && prop !== "dragActive",
})<IStyledDraggableFolderProps>(({ isOvered, dragActive }) => {
  const styles: Record<string, unknown> = {
    ...(isOvered ? overedStyle : {}),
    ...(dragActive ? dragActiveStyle : {}),
  };
  return styles;
});
