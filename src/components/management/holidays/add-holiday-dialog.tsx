import { Button, Dialog, DialogActions, DialogContent, MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { UseMutationResult } from "@tanstack/react-query";
import DialogHeader from "components/generic/dialog-header";
import { CompensationType, type Holiday } from "generated/client";
import type { TFunction } from "i18next";
import { DateTime } from "luxon";
import { type Key, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "src/utils/localization-utils";

type HolidayForm = {
  date: Date;
  name: string;
  compensationType: CompensationType;
};

type Props = {
  holiday?: Holiday;
  onSave?: UseMutationResult<void, Error, Holiday, unknown>;
  onClose: () => void;
};

const AddHolidayFormDialog = ({ holiday, onSave, onClose }: Props) => {
  const { t } = useTranslation();
  const date = DateTime.now();

  const {
    handleSubmit,
    setValue,
    resetField,
    register,
    formState: { errors },
  } = useForm<HolidayForm>({
    mode: "onChange",
    defaultValues: {
      date: date.toJSDate(),
      name: "",
      compensationType: CompensationType.PublicHolidayAllowance,
    },
  });

  const onSaveClick = async (holiday: Holiday) => {
    if (!onSave) return;
    await onSave.mutateAsync(holiday);
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
        title={t("management.holidays.addHoliday")}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit(onSaveClick)}>
        <DialogContent>
          <DatePicker
            label={t("management.holidays.date")}
            value={date}
            onChange={(value: DateTime | null) => (value ? setValue("date", value.toJSDate()) : resetField("date"))}
          />
          <TextField
            label={t("management.holidays.name")}
            type="name"
            value={holiday?.name}
            fullWidth
            margin="dense"
            {...register("name", { required: t("management.employees.errorMessages.lastNameMissing") })}
            helperText={errors.name?.message}
            error={!!errors.name?.message}
          />
          <TextField
            select
            label={t("management.holidays.compensationType.title")}
            fullWidth
            margin="dense"
            defaultValue={CompensationType.PublicHolidayAllowance}
            InputProps={{
              ...register("compensationType", {
                required: t("management.employees.errorMessages.officeMissing"),
              }),
              disableUnderline: true,
            }}
            helperText={errors.compensationType?.message}
            error={!!errors.compensationType?.message}
          >
            {renderLocalizedMenuItems(Object.values(CompensationType), LocalizationUtils.getLocalizedCompensationType)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" autoFocus disabled={!!Object.keys(errors).length}>
            {t("management.holidays.addHoliday")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddHolidayFormDialog;
