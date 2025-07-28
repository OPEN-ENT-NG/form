import { SxProps, Theme } from "@mui/material";
import { Paper, styled } from "@cgi-learning-hub/ui";
import { GREY_MAIN_COLOR } from "~/core/style/colors";
import { IStyledPaperProps } from "./types";
import { CSS_ERROR_MAIN_COLOR, CSS_WARNING_LIGHT_COLOR } from "~/core/style/cssColors";

export const questionStackStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 1,
  marginBottom: 2,
  padding: "0rem 3rem 3rem 3rem",
  boxShadow: "1px 4px 5px 2px rgba(0, 0, 0, 0.1)",
};

export const dragIconContainerStyle: SxProps<Theme> = {
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
};

export const dragIconStyle: SxProps<Theme> = { transform: "rotate(90deg)", color: GREY_MAIN_COLOR, fontSize: "3rem" };

export const questionTitleStyle: SxProps<Theme> = {
  marginBottom: 3,
  position: "relative",
};

export const mandatoryTitleStyle: SxProps<Theme> = {
  position: "absolute",
  right: -10,
  top: "0%",
};

export const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isValidFormElement",
})<IStyledPaperProps>(({ isValidFormElement }) => ({
  display: "flex",
  flexDirection: "column",
  borderLeft: "4px solid",
  marginBottom: "16px",
  paddingTop: "3rem",
  boxShadow: "1px 4px 5px 2px rgba(0, 0, 0, 0.1)",
  borderColor: isValidFormElement ? "transparent !important" : `${CSS_ERROR_MAIN_COLOR} !important`,
}));

export const editingQuestionTitleStyle: SxProps<Theme> = { paddingX: "3rem" };

export const editingQuestionContentStyle: SxProps<Theme> = { padding: "2rem 3rem 0 3rem" };

export const editingQuestionFooterStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingY: 1,
  paddingRight: "2.4rem",
};

export const mandatorySwitchContainerStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
};

export const editingQuestionIconContainerStyle: SxProps<Theme> = { marginLeft: "1rem" };

export const editingQuestionIconStyle: SxProps<Theme> = { fontSize: "2rem" };

export const questionAlertStyle: SxProps<Theme> = {
  marginBottom: 2,
  bgcolor: `${CSS_WARNING_LIGHT_COLOR} !important`,
};

export const conditionalSwitchContainerStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  marginLeft: 2,
};
