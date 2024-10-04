import { Add, ArrowDropDown, Download } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { GridColDef, GridPaginationModel, GridRenderEditCellParams } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet, createFileRoute, deepEqual, useNavigate } from "@tanstack/react-router";
import DialogHeader from "components/generic/dialog-header";
import GenericDataGrid from "components/generic/generic-data-grid";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import Holidays, { HolidaysTypes } from "date-holidays";
import { CompensationType, Holiday } from "generated/client";
import { useApi } from "hooks/use-api";
import { QUERY_KEYS, useHolidays } from "hooks/use-queries";
import { useSingleClickCellEditMode } from "hooks/use-single-click-cell-edit-mode";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LocalizationUtils from "src/utils/localization-utils";

// Styled root component
const Root = styled(Stack, {
  label: "management-equipment-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

export const Route = createFileRoute("/management/holidays")({
  component: ManagementHolidays,
  staticData: { breadcrumbs: ["management.holidays.title"] },
});

function ManagementHolidays() {
  const { holidaysApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [holidaysToCreate, setHolidaysToCreate] = useState<HolidaysTypes.Holiday[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const showConfirmDialog = useConfirmDialog();

  const { cellModesModel, handleCellClick, handleCellModelsChange } = useSingleClickCellEditMode();

  const holidaysQuery = useHolidays({
    first: paginationModel.pageSize * paginationModel.page,
    max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
  });

  const createHolidaysForEntireYear = useMutation({
    mutationFn: async (holidays: HolidaysTypes.Holiday[]) => {
      await Promise.all(
        holidays.map(async (holiday) =>
          holidaysApi.createHoliday({
            holiday: {
              date: DateTime.fromJSDate(holiday.start).set({ hour: 12 }).toJSDate(),
              name: holiday.name,
              compensationType: CompensationType.PublicHolidayAllowance,
            },
          }),
        ),
      );
      navigate({ to: "/management/holidays" });
    },
    onSuccess: () => {
      toast.success(t("management.holidays.successToast", { count: holidaysToCreate.length }));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOLIDAYS] });
      setHolidaysToCreate([]);
    },
    onError: () => toast.error(t("management.holidays.errorToast", { count: holidaysToCreate.length })),
  });

  const updateHoliday = useMutation({
    mutationFn: (holiday: Holiday) => {
      if (!holiday.id) return Promise.reject();
      return holidaysApi.updateHoliday({ holidayId: holiday.id, holiday: holiday });
    },
    onSuccess: () => {
      toast.success(t("management.holidays.editSuccessToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOLIDAYS] });
    },
    onError: () => toast.error(t("management.holidays.editErrorToast")),
  });

  const processRowUpdate = async (newRow: Holiday, oldRow: Holiday) => {
    if (deepEqual(oldRow, newRow)) return oldRow;

    return await updateHoliday.mutateAsync(newRow);
  };

  const deleteHoliday = useMutation({
    mutationFn: (holiday: Holiday) => {
      if (!holiday.id) return Promise.reject();
      return holidaysApi.deleteHoliday({ holidayId: holiday.id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOLIDAYS] }),
  });

  const renderCompensationTypeSingleSelectCell = ({ api, id, field, value }: GridRenderEditCellParams) => {
    const { setEditCellValue } = api;

    return (
      <TextField
        select
        SelectProps={{ defaultOpen: true }}
        defaultValue={value}
        onChange={({ target: { value } }) => setEditCellValue({ id: id, field: field, value: value })}
      >
        {[CompensationType.DayOffWorkAllowance, CompensationType.PublicHolidayAllowance].map((compensationType) => (
          <MenuItem key={compensationType} value={compensationType}>
            {LocalizationUtils.getLocalizedCompensationType(compensationType, t)}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const columns: GridColDef<Holiday>[] = useMemo(
    () => [
      {
        field: "date",
        headerAlign: "left",
        headerName: t("management.holidays.date"),
        sortable: false,
        flex: 1,
        valueFormatter: ({ value }) => DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_SHORT),
      },
      {
        field: "name",
        headerAlign: "left",
        headerName: t("management.holidays.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "compensationType",
        headerName: t("management.holidays.compensationType.title"),
        headerAlign: "left",
        flex: 1,
        editable: true,
        sortable: false,
        type: "singleSelect",
        valueOptions: [CompensationType.DayOffWorkAllowance, CompensationType.PublicHolidayAllowance],
        getOptionLabel: (value) => LocalizationUtils.getLocalizedCompensationType(value as CompensationType, t),
        getOptionValue: (value) => value,
        renderCell: ({ value }) => (
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Typography>{LocalizationUtils.getLocalizedCompensationType(value, t)}</Typography>
            <ArrowDropDown color="primary" fontSize="small" />
          </Stack>
        ),
        renderEditCell: renderCompensationTypeSingleSelectCell,
      },
      {
        field: "actions",
        type: "actions",
        width: 100,
        renderHeader: () => null,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Button
              title={t("management.holidays.deleteHoliday")}
              variant="text"
              color="error"
              size="small"
              onClick={() =>
                showConfirmDialog({
                  title: t("management.holidays.deleteHoliday"),
                  description: t("management.holidays.deleteConfirmationDescription", {
                    name: row.name,
                    date: DateTime.fromJSDate(row.date).toLocaleString(DateTime.DATE_SHORT),
                  }),
                  positiveButtonColor: "error",
                  positiveButtonText: t("delete"),
                  onPositiveClick: () => deleteHoliday.mutate(row),
                })
              }
            >
              {t("delete")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, deleteHoliday, showConfirmDialog, renderCompensationTypeSingleSelectCell],
  );

  const getHolidays = (year: number) => {
    setHolidaysToCreate(new Holidays("FI").getHolidays(year));
  };

  // Open the dialog to enter the year when the button is clicked
  const handleOpenYearDialog = () => {
    setIsYearDialogOpen(true);
  };

  // Handle year submission and fetching of holidays
  const handleYearSubmit = () => {
    getHolidays(Number(year)); // Fetch holidays based on the year
    setIsYearDialogOpen(false); // Close the year input dialog
    setIsConfirmDialogOpen(true); // Open the confirmation dialog
  };

  // Handle the confirmation
  const handleConfirm = async () => {
    await createHolidaysForEntireYear.mutateAsync(holidaysToCreate);
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  // Close the dialogs without doing anything
  const handleCancel = () => {
    setIsYearDialogOpen(false);
    setIsConfirmDialogOpen(false);
  };

  return (
    <LoaderWrapper loading={holidaysQuery.isLoading}>
      <Root>
        <ToolbarRow
          title={t("management.holidays.title")}
          toolbarButtons={
            <Stack direction="row" gap={1}>
              <Button size="small" variant="outlined" startIcon={<Download />} onClick={handleOpenYearDialog}>
                {t("management.holidays.getHolidays")}
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<Add />}
                onClick={() =>
                  navigate({
                    to: "/management/holidays/add-holiday",
                    search: { date: DateTime.now() },
                  })
                }
              >
                {t("management.holidays.addHoliday")}
              </Button>
            </Stack>
          }
        />
        <Stack flex={1} sx={{ height: "100%", overflowY: "auto" }}>
          <GenericDataGrid
            editMode="cell"
            onCellClick={handleCellClick}
            cellModesModel={cellModesModel}
            onCellModesModelChange={handleCellModelsChange}
            fullScreen
            autoHeight={false}
            rows={holidaysQuery.data?.holidays ?? []}
            columns={columns}
            rowCount={holidaysQuery.data?.totalResults}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            processRowUpdate={processRowUpdate}
            initialState={{
              sorting: {
                sortModel: [{ field: "date", sort: "desc" }],
              },
            }}
          />
        </Stack>
      </Root>

      {/* Dialog to enter the year */}
      <Dialog
        open={isYearDialogOpen}
        onClose={handleCancel}
        PaperProps={{ sx: { minWidth: "360px", margin: 0, borderRadius: 0 } }}
      >
        <DialogHeader
          closeTooltip={t("tooltips.closeDialog")}
          title={t("management.holidays.getHolidaysFromTheYear")}
          onClose={handleCancel}
        />
        <DialogContent>
          <TextField
            label={t("management.holidays.year")}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button onClick={handleYearSubmit} autoFocus>
            {t("management.holidays.getHolidays")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={isConfirmDialogOpen} onClose={handleCancel}>
        <DialogHeader
          closeTooltip={t("tooltips.closeDialog")}
          title={t("management.holidays.addHolidays")}
          onClose={handleCancel}
        />
        <DialogContent>
          <DialogContentText>
            {t("management.holidays.confirmationMessage", { year, holidayCount: holidaysToCreate.length })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleConfirm}
            autoFocus
            loading={createHolidaysForEntireYear.isPending}
          >
            {t("yes")}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Outlet />
    </LoaderWrapper>
  );
}
