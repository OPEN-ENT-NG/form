import { Box, styled } from "@cgi-learning-hub/ui";
import { StyledDraggableFolderProps } from "./types";
import { dragActiveStyle, droppableStyle, overedStyle } from "~/core/style/dndStyle";

export const StyledDraggableFolder = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOvered" && prop !== "dragActive",
})<StyledDraggableFolderProps>(({ isOvered, dragActive }) => ({
  ...droppableStyle,
  ...(isOvered && overedStyle),
  ...(dragActive && dragActiveStyle),
}));
