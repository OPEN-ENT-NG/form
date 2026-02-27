import { SxProps } from "@mui/material";

export const selectStyle: SxProps = {
  flex: 1,
  minWidth: 0,
  "& .MuiSelect-select": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
