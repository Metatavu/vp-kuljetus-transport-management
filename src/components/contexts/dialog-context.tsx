import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode, createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

type TDialogOptions = {
  title: string;
  description: string;
  positiveButtonText?: string;
  cancelButtonEnabled?: boolean;
  onPositiveClick: () => void | Promise<void>;
};

type ShowDialogHandler = (options: TDialogOptions) => void;

const DialogContext = createContext<ShowDialogHandler>(() => {
  throw new Error("Component must be wrapped with DialogProvider");
});

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<TDialogOptions>();
  const showDialog = (options: TDialogOptions) => {
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
          {options?.cancelButtonEnabled && <Button onClick={handleClose}>{t("cancel")}</Button>}
          <Button variant="contained" onClick={handleSubmit}>
            {options?.positiveButtonText || "OK"}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogContext.Provider value={showDialog}>{children}</DialogContext.Provider>
    </>
  );
};

export const useDialog = () => {
  return useContext(DialogContext);
};

export default DialogProvider;
