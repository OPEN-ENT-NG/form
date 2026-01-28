import { SxProps, Theme } from "@cgi-learning-hub/ui";
import { spaceBetweenBoxStyle } from "~/core/style/boxStyles";

export const headerStyle = (isTheme1D: boolean): SxProps<Theme> => {
  return {
    ...spaceBetweenBoxStyle,
    padding: "3rem 5rem 3rem 2rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    backgroundColor: isTheme1D ? "white" : "unset",
  };
};

export const leftBoxStyle = {
  display: "flex",
  gap: "1.5rem",
  flex: 1,
  flexWrap: "wrap",
  justifyContent: "space-between",
  minWidth: "fit-content",
};
export const saveBoxStyle = { flex: 1, display: "flex", justifyContent: "end", minWidth: "fit-content" };

export const headerButtonsStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexWrap: "wrap",
  gap: "1.5rem",
  flex: 1,
  minWidth: "fit-content",
};
