import { columnBoxStyle, flexStartBoxStyle } from "~/core/style/boxStyles";

export const mainColumnStyle = {
  ...flexStartBoxStyle,
  alignItems: "flex-start",
  gap: "3rem",
  display: "flex",
  flexDirection: "row",
  "@media (max-width: 768px)": {
    flexDirection: "column",
  },
};

export const fileDropZoneWrapper = {
  flexShrink: 0,
};

export const mainContentWrapper = {
  ...columnBoxStyle,
  gap: "2rem",
  flex: "1",
  overflow: "hidden",
  "& .MuiTextField-root": {
    maxWidth: "44rem",
  },
};

export const subContentColumnWrapper = {
  ...columnBoxStyle,
  gap: "1rem",
};
export const subContentRowWrapper = {
  ...flexStartBoxStyle,
  gap: "1rem",
};

export const textFieldStyle = {
  width: "100%",
  maxWidth: "44rem",
};

export const tooltipIconBoxStyle = {
  ...flexStartBoxStyle,
  width: "fit-content",
  gap: ".5rem",
};

export const checkboxRowStyle = {
  ...flexStartBoxStyle,
  width: "fit-content",
  gap: "1rem",
};

export const dateEndingCheckboxStyle = {
  ...flexStartBoxStyle,
  width: "fit-content",
  gap: ".5rem",
};

export const rgpdContentRowStyle = {
  ...subContentRowWrapper,
  marginLeft: "3.2rem",
};

export const datePickerWrapperStyle = {
  width: "16rem",
  "& .MuiInputBase-input": {
    padding: "1rem",
  },
};
