/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
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
