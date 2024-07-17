import { Button, ButtonOwnProps, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode, createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

type ConfirmDialogOptions = {
  title: string;
  description: string;
  positiveButtonText?: string;
  cancelButtonEnabled?: boolean;
  positiveButtonColor?: ButtonOwnProps["color"];
  onPositiveClick: () => void | Promise<void>;
};

type ShowConfirmDialogHandler = (options: ConfirmDialogOptions) => void;

const ConfirmDialogContext = createContext<ShowConfirmDialogHandler>(() => {
  throw new Error("Component must be wrapped with DialogProvider");
});

const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>();
  const showDialog = (options: ConfirmDialogOptions) => {
    setOpen(true);
    setOptions(options);
  };
  const { t } = useTranslation();
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    options?.onPositiveClick();
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{options?.title}</DialogTitle>
        <DialogContent>{options?.description}</DialogContent>
        <DialogActions>
          {options?.cancelButtonEnabled && (
            <Button variant="text" onClick={handleClose}>
              {t("cancel")}
            </Button>
          )}
          <Button variant="contained" color={options?.positiveButtonColor} onClick={handleSubmit}>
            {options?.positiveButtonText || "OK"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialogContext.Provider value={showDialog}>{children}</ConfirmDialogContext.Provider>
    </>
  );
};

export const useConfirmDialog = () => {
  return useContext(ConfirmDialogContext);
};

export default ConfirmDialogProvider;
