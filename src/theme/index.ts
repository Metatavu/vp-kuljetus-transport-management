import { createTheme } from "@mui/material";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { fiFI } from "@mui/x-date-pickers";

/**
 * Extend theme with custom variables in here
 */
declare module "@mui/material/styles" {
  // interface Theme {
  //   status: {
  //     danger: string;
  //   };
  // }
  // allow configuration using `createTheme`
  // interface ThemeOptions {
  //   status?: {
  //     danger?: string;
  //   };
  // }
}

const theme = createTheme(
  {
    typography: {
      fontFamily: ["Proxima-nova", "sans-serif"].join(","),
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 700,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 700,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 700,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
      },
      button: {
        fontSize: 14,
        fontWeight: 500,
        fontStyle: "normal",
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
      },
      overline: {
        fontSize: "0.75rem",
        fontWeight: 700,
      },
    },
    palette: {
      background: {
        default: "#EFEFEF",
        paper: "#FFFFFF",
      },
      primary: {
        main: "#00414F",
        light: "#547476",
      },
    },
    components: {
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(0, 65, 79, 0.5)",
            backdropFilter: "blur(2px)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#FFFFFF",
          },
        },
      },
      MuiTabs: {
        variants: [
          {
            props: { orientation: "vertical" },
            style: {
              "& .MuiTab-root": {
                fontSize: 14,
              },
              "& .MuiSvgIcon-root": {
                width: 16,
                height: 16,
              },
            },
          },
          {
            props: { orientation: "horizontal" },
            style: {
              minHeight: "initial",
              "& .MuiTab-root": {
                fontSize: 14,
                padding: "8px 16px",
                minHeight: "initial",
              },
            },
          },
        ],
      },
      MuiTab: {
        defaultProps: {},
        styleOverrides: {
          root: {
            fontSize: 14,
            fontWeight: 500,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          size: "small",
          variant: "contained",
          color: "primary",
        },
      },
      MuiIconButton: {
        defaultProps: {
          color: "primary",
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        variants: [
          {
            props: { select: true },
            style: {
              "& .MuiSelect-select": {
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                borderRadius: "4px",
                padding: "4px 8px",
              },
            },
          },
        ],
        defaultProps: {
          variant: "standard",
          fullWidth: true,
          InputProps: { disableUnderline: true },
          InputLabelProps: { shrink: true },
          inputProps: {
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.06)",
              padding: "4px 8px",
              borderRadius: "4px",
            },
          },
        },
      },
      MuiDatePicker: {
        defaultProps: {
          slotProps: {
            textField: {
              variant: "standard",
              size: "small",
              sx: {
                "& .MuiInputBase-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  margin: 0,
                },
              },
              InputProps: { disableUnderline: true },
              InputLabelProps: { shrink: true },
            },
            inputAdornment: { sx: { padding: 0, margin: 0 } },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "#EDF3F5",
            padding: "0px 10px",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "0px 10px",
            height: "30px",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
  },
  fiFI,
);

export { theme };
