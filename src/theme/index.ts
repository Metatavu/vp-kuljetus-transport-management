import { createTheme } from "@mui/material";

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
      defaultProps: {
        variant: "standard",
        fullWidth: true,
        InputLabelProps: { shrink: true },
        InputProps: { disableUnderline: true },
        inputProps: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "4px"
        }}
      }
    },
  },
});

export { theme };
