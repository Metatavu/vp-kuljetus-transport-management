import { createTheme } from "@mui/material";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { fiFI } from "@mui/x-date-pickers";
import type {} from "@mui/x-date-pickers/themeAugmentation";

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
      fontFamily: ["Lato", "sans-serif"].join(","),
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
        fontSize: "0.875rem",
        fontWeight: 700,
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
        fontWeight: 700,
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 700,
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
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#FFFFFF",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            cursor: "pointer",
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
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minWidth: "inherit",
            width: "fit-content",
            whiteSpace: "nowrap",
            borderRadius: 3,
            padding: "3px 9px",
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          color: "primary",
        },
      },
      // Autocomplete overrides
      MuiAutocomplete: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            padding: "0px",
            width: "100%",
            "& .MuiFilledInput-root": {
              paddingTop: 0,
              backgroundColor: "rgba(0, 0, 0, 0.06)",
              borderRadius: "4px",
              "&.MuiInputBase-sizeSmall .MuiFilledInput-input": {
                padding: "4px 0",
                margin: 0,
                boxSizing: "border-box",
                height: "auto",
                width: "100%",
              },
              "&::before": {
                display: "none",
              },
            },
            "& .MuiFilledInput-input": {
              backgroundColor: "transparent",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: 14,
            position: "relative",
            transform: "none",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          input: {
            padding: "4px 8px",
            margin: 0,
            boxSizing: "border-box",
            height: "auto",
            backgroundColor: "#ffffff",
            "&::focus": {
              outline: "1px solid #00414F",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          standard: {
            padding: "4px 8px",
            margin: 0,
            boxSizing: "border-box",
            height: "auto",
            backgroundColor: "#ffffff",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            height: "auto",
            margin: 0,
            marginTop: 0,
            display: "inline-flex",
            minWidth: 0,
            padding: 0,
            borderRadius: "4px",
            backgroundColor: "#ffffff",
          },
          input: {
            padding: "4px 8px",
            margin: 0,
            boxSizing: "border-box",
            height: "auto",
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& label + .MuiInputBase-root": {
              marginTop: 0, // Remove the default margin-top when label is followed by an input
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            height: "auto",
            margin: 0,
            display: "inline-flex",
            minWidth: 0,
            padding: 0,
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "4px",
          },
          input: {
            backgroundColor: "transparent",
            padding: "4px 8px",
            margin: 0,
            boxSizing: "border-box",
            height: "auto",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "filled",
          fullWidth: true,
          InputLabelProps: { shrink: true },
        },
        styleOverrides: {
          root: {
            "&.cell-input input": {
              padding: "4px 8px",
              textAlign: "center",
              fontSize: 14,
            },
            "&.align-left input": {
              textAlign: "left",
            },
            "&.cell-input .MuiSelect-select": {
              padding: 4,
              fontSize: 14,
            },
            "&.cell-input .MuiOutlinedInput-root": {
              padding: 0,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            "&.cell-checkbox": {
              padding: 4,
            },
          },
        },
      },
      MuiDatePicker: {
        defaultProps: {
          slotProps: {
            textField: {
              variant: "filled",
              size: "small",
              InputProps: { disableUnderline: true },
              InputLabelProps: { shrink: true },
            },
          },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          root: {
            zIndex: 1302,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "#EDF3F5",
            padding: "0px 14px",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "0px 14px",
            height: "30px",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            "&:focus, &:focus-within": {
              outline: "transparent",
            },
            "&.clickable": {
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgb(84, 116, 118, 0.1)",
              },
              "&:active": {
                backgroundColor: "rgb(84, 116, 118, 0.15)",
              },
            },
          },
        },
      },
    },
  },
  fiFI,
);

export { theme };
