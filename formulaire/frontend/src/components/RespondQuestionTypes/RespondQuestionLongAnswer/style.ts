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
};
