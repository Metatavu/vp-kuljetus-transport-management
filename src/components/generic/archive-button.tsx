import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  description: string;
  onArchive: () => void;
};

const ArchiveButton = ({ title, description, onArchive }: Props) => {
  const { t } = useTranslation();
  const showConfirmDialog = useConfirmDialog();

  const onButtonClick = useCallback(
    () =>
      showConfirmDialog({
        title: title,
        description: description,
        cancelButtonEnabled: true,
        positiveButtonColor: "error",
        positiveButtonText: t("archive"),
        onPositiveClick: onArchive,
      }),
    [t, title, description, onArchive, showConfirmDialog],
  );

  return (
    <Button
      variant="text"
      color="error"
      startIcon={<CloseIcon />}
      sx={{ alignSelf: "flex-end" }}
      onClick={onButtonClick}
    >
      {t("archive")}
    </Button>
  );
};

export default ArchiveButton;
