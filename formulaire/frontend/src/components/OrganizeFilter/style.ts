import { PopoverOrigin } from "@mui/material";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";
import { CSS_PRIMARY_LIGHT_COLOR } from "~/core/style/cssColors";

export const menuStyle = {
  "& .MuiPaper-root": {
    padding: "1rem",
    marginTop: "0.5rem",
  },
};

export const buttonStyle = {
  ...spaceBetweenBoxStyle,
  gap: "1rem",
};

export const sortTitleStyle = {
  paddingBottom: ".5rem",
  fontWeight: "bold",
};

export const filterTitleStyle = {
  padding: "1rem 0px .5rem .5rem",
  fontWeight: "bold",
};

export const sortContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: ".5rem",
  paddingBottom: ".5rem",
};

export const sortMenuItem = {
  display: "flex",
  alignItems: "center",
  paddingLeft: "3rem",
  borderRadius: ".5rem",
  backgroundColor: "transparent",
  "&.Mui-selected": {
    backgroundColor: CSS_PRIMARY_LIGHT_COLOR,
    "&:hover": {
      backgroundColor: CSS_PRIMARY_LIGHT_COLOR,
    },
  },
};

export const chipMenuItemStyle = {
  "&:hover": {
    backgroundColor: "transparent",
  },
};

export const chipContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
};

export const filterArrowStyle = {
  position: "absolute",
  left: ".4rem",
};

export const menuAnchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

export const menuTransformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};
