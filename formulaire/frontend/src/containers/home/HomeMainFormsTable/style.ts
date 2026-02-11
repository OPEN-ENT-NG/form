import { SxProps, Theme } from "@mui/material";

import { centerBoxStyle } from "~/core/style/boxStyles";

export const tablePaginationStyle = {
  overflow: "unset",
};

export const iconBoxStyle: SxProps = { ...centerBoxStyle, gap: ".5rem" };

export const tableCheckboxStyle: SxProps<Theme> = {
  padding: 0,
};

export const tableContainerStyle: SxProps<Theme> = {
  paddingBottom: "3rem",
};
