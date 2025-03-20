import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Components {
    MuiPickersLayout?: {
      styleOverrides?: {
        root?: React.CSSProperties | any;
      };
    };
  }
}

