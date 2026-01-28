import { Box, styled } from "@cgi-learning-hub/ui";

import { IEditorWrapperProps } from "./types";

const flexContainerStyles = {
  display: "flex",
  width: "100%",

  "& > :first-child": {
    flex: "1 1 auto",
    width: "100%",
  },
};

export const StyledEditorWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCurrentEditingElement",
})<IEditorWrapperProps>(({ isCurrentEditingElement }) => {
  // if not Editing our target is the first child
  const nth = isCurrentEditingElement ? 2 : 1;

  //Selector Tree for the Editor component
  const editorTree = {
    "> :first-child": {
      [`> :nth-child(${nth})`]: {
        ...(isCurrentEditingElement && { minHeight: "200px" }),
        "> :first-child": flexContainerStyles,
      },
    },
  };

  // if not editing, add the disable‐interaction bits
  if (!isCurrentEditingElement) {
    return {
      userSelect: "none",
      pointerEvents: "none",
      ...editorTree,
    };
  }

  return editorTree;
});
