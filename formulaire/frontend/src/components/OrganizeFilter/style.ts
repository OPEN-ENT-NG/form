import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const menuStyle = {
  "& .MuiPaper-root": {
    padding: "1rem",
  },
};

export const buttonStyle = {
  ...spaceBetweenBoxStyle,
  gap: "1rem",
};

export const sortTitleStyle = {
  paddingBottom: ".5rem",
};

export const filterTitleStyle = {
  padding: "1rem 0px .5rem .5rem",
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
    backgroundColor: "var(--theme-palette-primary-light)",
    "&:hover": {
      backgroundColor: "var(--theme-palette-primary-light)",
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
