import { Box, styled } from "@cgi-learning-hub/ui";
import { columnBoxStyle, flexStartBoxStyle } from "~/core/style/boxStyles";
import { blockProps } from "~/core/utils";
import { IDatePickerWrapperProps } from "./types";

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

export const pictureAndTitleMobileWrapper = {
  ...flexStartBoxStyle,
  paddingRight: "2rem",
};

export const fileDropZoneWrapper = {
  flexShrink: 0,
};

export const mainContentWrapper = {
  ...columnBoxStyle,
  gap: "3rem",
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

export const contentRowWrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
};

export const subContentRowWrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "1rem",
};

export const subContentRowMobileWrapper = {
  ...columnBoxStyle,
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

export const StyledDatePickerWrapper = styled(Box, {
  shouldForwardProp: blockProps("isMobile"),
})<IDatePickerWrapperProps>(({ isMobile = false }) => ({
  width: isMobile ? "15rem" : "16rem",
  "& .MuiInputBase-input": {
    padding: "1rem",
  },
}));
