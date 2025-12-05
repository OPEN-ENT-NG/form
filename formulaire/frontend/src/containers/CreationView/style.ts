import { SxProps, Theme } from "@cgi-learning-hub/ui";

export const creationViewStyle: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export const creationHedearStyle: SxProps<Theme> = {
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: 3,
  backgroundColor: "var(--edifice-body-bg) !important",
};

export const emptyStateWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  padding: "3rem",
  gap: 3,
  textAlign: "center",
};
