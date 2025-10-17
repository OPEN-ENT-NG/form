import { Box, styled } from "@cgi-learning-hub/ui";
import { IStyledDraggableFolderProps } from "./types";
import { dragActiveStyle, overedStyle } from "~/core/style/dndStyle";
import { blockProps } from "~/core/utils";

export const StyledDraggableFolder = styled(Box, {
  shouldForwardProp: blockProps("isOvered", "dragActive"),
})<IStyledDraggableFolderProps>(({ isOvered, dragActive }) => {
  const styles: Record<string, unknown> = {
    ...(isOvered ? overedStyle : {}),
    ...(dragActive ? dragActiveStyle : {}),
  };
  return { width: "320px", ...styles };
});
