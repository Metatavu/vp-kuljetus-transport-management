import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "generated/router/routeTree.gen";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider, responsiveFontSizes } from "@mui/material";
import { theme } from "./theme";
import "localization/i18n";
import AuthenticationProvider from "components/auth/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConfirmDialogProvider from "components/providers/confirm-dialog-provider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No root element in index.html");

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={responsiveFontSizes(theme)}>
        <ToastContainer autoClose={3000} hideProgressBar transition={Flip} />
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="fi">
          <CssBaseline />
          <AuthenticationProvider>
            <QueryClientProvider client={queryClient}>
              <ConfirmDialogProvider>
                <RouterProvider router={router} />
              </ConfirmDialogProvider>
            </QueryClientProvider>
          </AuthenticationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
