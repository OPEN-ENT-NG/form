import { SxProps } from "@mui/material";
import { PRIMARY_MAIN_COLOR } from "~/core/style/colors";

export const questionChoiceWrapperStyle: SxProps = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
};

export const choiceInputStyle: SxProps = {
  display: "flex",
  width: "100%",
  alignItems: "center",
};

export const choiceIconStyle: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 0,
  minWidth: "24px",
  minHeight: "24px",
  "& > svg": {
    fontSize: "2.4rem !important",
  },
};

export const imageIconStyle: SxProps = {
  color: PRIMARY_MAIN_COLOR,
  paddingX: "0.2rem",
};

export const mediaLibraryWrapperStyle: SxProps = {
  display: "flex",
  flexDirection: "row",
  marginLeft: 2,
  marginTop: 2,
};

export const deleteIconStyle: SxProps = {
  height: 36,
};
