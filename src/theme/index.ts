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

const theme = createTheme({
  palette: {
    background: {
      default: "#EFEFEF",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#00414F",
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
    MuiIconButton: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiTextField: {
      variants: [{
        props: {select: true},
        style: {
          "& .MuiSelect-select": {
          backgroundColor: "rgba(0, 0, 0, 0.06)",
          borderRadius: "4px",
          padding: "4px 8px"
          }
        }
      }],
      defaultProps: {
        variant: "standard",
        fullWidth: true,
        InputLabelProps: { shrink: true },
        InputProps: { disableUnderline: true },
        inputProps: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            padding: "4px 8px",
            borderRadius: "4px"
        }}
      }
    },
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          textField: {
            variant: "standard",
            size: "small",
            InputProps: { disableUnderline: true },
            InputLabelProps: { shrink: true },
          },
          inputAdornment: { sx: { padding: 0, margin: 0 } },
        },
        sx: {
          "& .MuiInputBase-root": {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "4px",
            padding: "4px 8px",
          },
        }
      }
    }
  },
}, fiFI);

export { theme };
