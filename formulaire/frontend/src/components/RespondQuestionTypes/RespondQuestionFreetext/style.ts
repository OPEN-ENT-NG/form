import { SxProps, Theme } from "@cgi-learning-hub/ui";

const flexContainerStyles: SxProps<Theme> = {
  display: "flex",
  width: "100%",

  "& > :first-child": {
    flex: "1 1 auto",
    width: "100%",
  },
};

export const editorWrapperStyle: SxProps<Theme> = {
  userSelect: "none",
  pointerEvents: "none",
  "> :first-child": {
    [`> :nth-child(1)`]: {
      "> :first-child": flexContainerStyles,
    },
  },
};
