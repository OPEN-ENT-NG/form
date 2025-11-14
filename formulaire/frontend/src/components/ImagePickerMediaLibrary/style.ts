import { Box, styled, SxProps, Theme } from "@cgi-learning-hub/ui";
import { blockProps } from "~/core/utils";
import { IContainerProps } from "./types";
import { CSS_COMMON_WHITE_COLOR } from "~/core/style/cssColors";

export const StyledContainer = styled(Box, {
  shouldForwardProp: blockProps("isMobile"),
})<IContainerProps>(({ isMobile = false }) => ({
  position: "relative",
  ...(isMobile && {
    "> .MuiBox-root": {
      minWidth: 100,
      minHeight: 100,
    },
  }),
}));

export const imagePickerContainerStyle = (currentSrc: string | null): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  position: "relative",
  minWidth: "150px",
  minHeight: "150px",
  borderRadius: 1,
  background: !currentSrc ? "linear-gradient(180deg, #F5F7F9 0%, #FFF 100%)" : "none",
  border: !currentSrc ? "1px dashed" : "none",
  borderColor: !currentSrc ? "grey.main" : undefined,
});

export const emptyStateContentStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0.5rem",
  gap: "0.3rem",
};

export const iconStyle: SxProps<Theme> = {
  width: "3rem",
  height: "3rem",
};

export const labelTextStyle: SxProps<Theme> = {
  textAlign: "center",
  fontSize: "14px",
  color: "grey.darker",
};

export const infoTextStyle: SxProps<Theme> = {
  textAlign: "center",
  fontSize: "12px",
  color: "grey",
};

export const actionsContainerStyle: SxProps<Theme> = {
  position: "absolute",
  top: "0.8rem",
  right: "0.8rem",
  display: "flex",
  gap: "0.5rem",
};

export const actionButtonStyle: SxProps<Theme> = {
  backgroundColor: "common.white",
  display: "flex",
  borderRadius: "3px",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: 1,
  width: "2rem",
  height: "2rem",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    fontSize: "1.5rem",
  },
  "&:hover": {
    backgroundColor: "grey.darker",
    "& .MuiSvgIcon-root": {
      fill: CSS_COMMON_WHITE_COLOR,
    },
  },
};

export const imageStyle = {
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  objectFit: "cover" as const,
  borderRadius: "5px",
};

// Vous pouvez simplifier le style maintenant que nous utilisons un portail
export const mediaLibraryStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
