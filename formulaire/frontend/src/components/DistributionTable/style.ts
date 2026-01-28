import { styled, SxProps, TableBody } from "@cgi-learning-hub/ui";

import { blockProps } from "~/core/utils";

import { ITableBodyProps } from "./types";

export const tableStyle: SxProps = {
  tableLayout: "fixed",
  width: "100%",
  borderCollapse: "separate",
  "& .MuiTableCell-root": {
    borderLeft: "none",
    borderRight: "none",
  },
};

export const containerStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
};
export const tableCellStyle = {
  borderLeft: "none",
  borderRight: "none",
};
export const paperStyle: SxProps = {
  boxShadow: "none",
  width: "100%",
};

export const headerRowStyle: SxProps = {
  display: "table",
  width: "100%",
  backgroundColor: "primary.main",
  borderRadius: "0.5rem",
  overflow: "hidden",
};

export const headerCellStyle: SxProps = {
  color: "common.white",
  backgroundColor: "primary.main",
};

export const StyledTableBody = styled(TableBody, {
  shouldForwardProp: blockProps("isMobile"),
})<ITableBodyProps>(({ isMobile = false }) => ({
  display: "block",
  maxHeight: `calc(50vh - ${isMobile ? 17 : 10}rem)`,
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "0.25rem",
  },
}));

export const tableRowStyle: SxProps = {
  display: "table",
  width: "100%",
  tableLayout: "fixed",
  "&:last-child td, &:last-child th": {
    border: 0,
  },
};

export const tableRowMobileStyle: SxProps = {
  padding: "6px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const emptyRowMessageStyle: SxProps = {
  py: "1.25rem",
};

export const seeMoreButtonContainerStyle: SxProps = {
  mt: "0.5rem",
};

export const seeMoreButtonStyle: SxProps = {
  textTransform: "none",
};
