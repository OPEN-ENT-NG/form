import { SxProps } from "@cgi-learning-hub/ui";

export const toasterWrapper: SxProps = {
  position: "fixed",
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: "100",
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  background: "var(--theme-palette-primary-main)",
};

export const toasterButtonStyle: SxProps = {
  color: "common.white",
  transition: "all 0.2s ease-in-out",
  borderRadius: "4px",
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "var(--theme-palette-primary-dark)",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};
