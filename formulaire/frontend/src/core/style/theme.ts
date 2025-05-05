import { ThemeOptions } from "@cgi-learning-hub/ui";

export const options: ThemeOptions = {
  typography: {
    fontFamily: "Roboto",
    h1: {
      fontSize: "2.4rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.8rem",
    },
    h4: {
      fontSize: "1.8rem",
    },
    body1: {
      fontSize: "1.6rem",
    },
    body2: {
      fontSize: "1.4rem",
    },
    caption: {
      fontSize: "1.2rem",
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: "0.4rem",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
          fontWeight: "bold",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "2rem",
          fontWeight: "bold",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            fontSize: "2.1rem",
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            fontSize: "1.4rem",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            fontSize: "1.4rem",
          },
        },
        {
          props: { variant: "text" },
          style: {
            fontSize: "1.4rem",
          },
        },
      ],
    },
    MuiMobileStepper: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.2rem",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "2.4rem",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            "&.Mui-selected": {
              backgroundColor: "var(--theme-palette-primary-main)",
              color: "white",
              "&:hover": {
                backgroundColor: "var(--theme-palette-primary-main)",
              },
            },
          },
        },
      },
    },
  },
};
