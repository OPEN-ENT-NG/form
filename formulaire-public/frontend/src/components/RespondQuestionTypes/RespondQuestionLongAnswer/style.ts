const flexContainerStyles = {
  display: "flex",
  width: "100%",

  "& > :first-child": {
    flex: "1 1 auto",
    width: "100%",
  },
};

export const respondQuestionLongAnswerStyle = {
  "& > :first-child > :nth-child(2)": {
    minHeight: "200px",
    "> :first-child": flexContainerStyles,
  },
  ".editor-toolbar .toolbar .toolbar-divider:not(.toolbar-divider ~ .toolbar-divider), button[aria-label='Ajout image'], button[aria-label='Ajout vidéo'], button[aria-label='Ajout audio'], button[aria-label='Ajout pièce jointe']":
    {
      display: "none !important",
    },
};
