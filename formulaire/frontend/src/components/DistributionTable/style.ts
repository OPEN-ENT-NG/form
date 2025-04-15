import { SxProps } from "@mui/material";

export const tableStyle: SxProps = {
  tableLayout: "fixed",
  display: "flex",
  flexDirection: "column",
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

export const tableBodyStyle: SxProps = {
  display: "block",
  maxHeight: "calc(50vh - 10rem)",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "0.25rem",
  },
};

export const tableRowStyle: SxProps = {
  display: "table",
  width: "100%",
  "&:last-child td, &:last-child th": {
    border: 0,
  },
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
