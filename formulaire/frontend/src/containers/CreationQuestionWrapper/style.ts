import { SxProps, Theme } from "@mui/material";
import { GREY_MAIN_COLOR, SECONDARY_MAIN_COLOR } from "~/core/style/colors";

export const questionStackStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 1,
  marginBottom: 2,
  padding: "0rem 3rem 3rem 3rem",
};

export const dragIconContainerStyle: SxProps<Theme> = {
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
};

export const dragIconStyle: SxProps<Theme> = { transform: "rotate(90deg)", color: GREY_MAIN_COLOR, fontSize: "3rem" };

export const questionTitleStyle: SxProps<Theme> = { marginBottom: 3 };

export const editingQuestionStackStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  borderLeft: 4,
  borderColor: SECONDARY_MAIN_COLOR,
  borderRadius: 1,
  marginBottom: 2,
  paddingTop: 3,
};

export const editingQuestionTitleStyle: SxProps<Theme> = { paddingX: "3rem" };

export const editingQuestionContentStyle: SxProps<Theme> = { padding: 2 };

export const editingQuestionFooterStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: 1,
};

export const editingQuestionIconContainerStyle: SxProps<Theme> = { marginLeft: "1rem" };

export const editingQuestionIconStyle: SxProps<Theme> = { fontSize: "2rem" };

export const questionAlertStyle: SxProps<Theme> = { marginBottom: 2 };
