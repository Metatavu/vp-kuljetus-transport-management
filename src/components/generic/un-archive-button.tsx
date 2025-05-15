import { Replay } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  description: string;
  onUnArchive: () => void;
};

const UnArchiveButton = ({ title, description, onUnArchive }: Props) => {
  const { t } = useTranslation();
  const showConfirmDialog = useConfirmDialog();

  const onButtonClick = useCallback(
    () =>
      showConfirmDialog({
        title: title,
        description: description,
        positiveButtonColor: "primary",
        positiveButtonText: t("unArchive"),
        onPositiveClick: onUnArchive,
      }),
    [t, title, description, onUnArchive, showConfirmDialog],
  );

  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<Replay />}
      sx={{ alignSelf: "flex-end" }}
      onClick={onButtonClick}
    >
      {t("unArchive")}
    </Button>
  );
};

export default UnArchiveButton;
