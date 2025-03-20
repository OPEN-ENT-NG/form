import { modalBoxStyle } from "~/core/style/boxStyles";
import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";

export const formPropModalWrapper = {
  ...modalBoxStyle,
  width: "90rem",
  maxWidth: "90vw",
  maxHeight: "90vh",
  minWidth: "50rem",
  display: "flex",
  overflowY: "auto",
  flexDirection: "column",
  padding: "2rem",
  "&::-webkit-scrollbar": {
    width: "1.5rem",
    height: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(170,170,170,1)",
    borderRadius: "0.8rem",
    border: "3px solid transparent",
    backgroundClip: "content-box",
  },
};

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
