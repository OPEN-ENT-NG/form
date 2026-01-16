import { ThemeOptions } from "@cgi-learning-hub/ui";
import { CSS_PRIMARY_MAIN_COLOR } from "./cssColors";
import { TypographyFontStyle } from "./themeProps";

export const getOptions = (isTheme1D: boolean): ThemeOptions => {
  return {
    typography: {
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
      h5: {
        fontSize: "1.8rem",
      },
      h6: {
        fontSize: "1.6rem",
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
            fontWeight: TypographyFontStyle.BOLD,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: "2rem",
            fontWeight: TypographyFontStyle.BOLD,
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
        styleOverrides: {
          root: {
            fontSize: isTheme1D ? "2.2rem" : "1.4rem",
          },
        },
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
      MuiTablePagination: {
        styleOverrides: {
          input: {
            fontSize: "1.4rem",
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            "& .MuiPaginationItem-root": {
              "&.Mui-selected": {
                backgroundColor: CSS_PRIMARY_MAIN_COLOR,
                color: "white",
                "&:hover": {
                  backgroundColor: CSS_PRIMARY_MAIN_COLOR,
                },
              },
            },
          },
        },
      },
      MuiPickersLayout: {
        styleOverrides: {
          root: {
            "& .MuiPickersYear-yearButton": {
              fontSize: "1.6rem",
            },
            "& .css-1ctqu56-MuiPickersYear-yearButton": {
              fontSize: "1.6rem",
            },
          },
        },
      },
    },
  };
};
