import { Button, Dialog, DialogActions, DialogContent, MenuItem, TextField } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import DialogHeader from "components/generic/dialog-header";
import { PagingPolicyContact, PagingPolicyType } from "generated/client";
import { TFunction } from "i18next";
import { Key, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "src/utils/localization-utils";

type PagingPolicyContactForm = {
  name: string;
  contact: string;
  type: PagingPolicyType;
  id: string;
};

type Props = {
  onModify?: UseMutationResult<void, Error, PagingPolicyContact, unknown>;
  onClose: () => void;
  pagingPolicyContact?: PagingPolicyContact;
};

const ModifyAlarmContactFormDialog = ({ pagingPolicyContact, onModify, onClose }: Props) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PagingPolicyContactForm>({
    mode: "onChange",
    defaultValues: {
      name: pagingPolicyContact?.name,
      contact: pagingPolicyContact?.contact,
      type: pagingPolicyContact?.type ?? PagingPolicyType.Email,
      id: pagingPolicyContact?.id,
    },
  });

  const onSaveClick = async (pagingPolicyContact: PagingPolicyContact) => {
    if (!onModify || !pagingPolicyContact.id) return;
    await onModify.mutateAsync(pagingPolicyContact);
  };

  const renderLocalizedMenuItem = useCallback(
    <T extends string>(value: T, labelResolver: (value: T, t: TFunction) => string) => (
      <MenuItem key={value as Key} value={value}>
        {labelResolver(value, t)}
      </MenuItem>
    ),
    [t],
  );

  const renderLocalizedMenuItems = useCallback(
    <T extends string>(items: string[], labelResolver: (value: T, t: TFunction) => string) =>
      items.map((item) => renderLocalizedMenuItem(item as T, labelResolver)),
    [renderLocalizedMenuItem],
  );

  return (
    <Dialog open onClose={onClose} PaperProps={{ sx: { minWidth: "260px", margin: 0, borderRadius: 0 } }}>
      <DialogHeader
        closeTooltip={t("tooltips.closeDialog")}
        title={t("management.alarmContacts.editAlarmContact")}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit(onSaveClick)}>
        <DialogContent>
          <TextField
            label={t("management.alarmContacts.name")}
            type="name"
            defaultValue={pagingPolicyContact?.name}
            fullWidth
            margin="dense"
            {...register("name")}
            helperText={errors.name?.message}
            error={!!errors.name?.message}
          />
          <TextField
            select
            label={t("management.alarmContacts.type")}
            fullWidth
            margin="dense"
            defaultValue={PagingPolicyType.Email}
            InputProps={{
              ...register("type", {
                required: t("management.employees.errorMessages.officeMissing"),
              }),
              disableUnderline: true,
            }}
          >
            {renderLocalizedMenuItems(
              Object.values(PagingPolicyType),
              (value, t) => LocalizationUtils.getLocalizedPagingPolicyType(value, t) ?? "",
            )}
          </TextField>
          <TextField
            label={t("management.alarmContacts.contact")}
            type="contact"
            defaultValue={pagingPolicyContact?.contact}
            fullWidth
            margin="dense"
            {...register("contact", {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t("management.alarmContacts.errorEmail"),
              },
            })}
            helperText={errors.contact?.message}
            error={!!errors.contact?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" autoFocus disabled={!!Object.keys(errors).length}>
            {t("management.alarmContacts.editAlarmContact")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModifyAlarmContactFormDialog;
