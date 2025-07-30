import { styled, Box } from "@cgi-learning-hub/ui";
import { IEditorWrapperProps } from "./types";

export const StyledEditorWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCurrentEditingElement",
})<IEditorWrapperProps>(({ isCurrentEditingElement }) => {
  if (!isCurrentEditingElement) return { userSelect: "none", pointerEvents: "none" };
  return {
    "> :first-child": {
      "> :nth-child(2)": {
        minHeight: "200px",

        "> :first-child": {
          display: "flex",

          "& > :first-child": {
            flex: "1 1 auto",
          },
        },
      },
    },
  };
});
