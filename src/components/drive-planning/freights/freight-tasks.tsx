import GenericDataGrid from "components/generic/generic-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";
import { Route, Site, Task } from "generated/client";
import { DateTime } from "luxon";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";
import { useRoutes } from "hooks/use-queries";

type Props = {
  customerSites: Site[];
  tasks: Task[];
  onEditTask: (task: Task) => void;
};

const FreightTasks = ({ tasks, customerSites, onEditTask }: Props) => {
  const { t } = useTranslation();

  const routesQuery = useRoutes({ departureAfter: DateTime.now().minus({ days: 1 }).toJSDate() });

  const { rowModesModel, handleCellClick, handleRowModelsChange } = useSingleClickRowEditMode();

  const processRowUpdate = (newRow: Task) => {
    onEditTask(newRow);
    return newRow;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "type",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.tasks"),
        flex: 1,
        sortable: false,
        renderCell: ({ row: { type } }) => LocalizationUtils.getLocalizedTaskType(type, t),
      },
      {
        field: "groupNumber",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.groupNumber"),
        flex: 1,
        sortable: false,
        editable: true,
        type: "number",
        align: "left",
      },
      {
        field: "customerSiteId",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.customerSite"),
        flex: 3,
        sortable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: customerSites,
        getOptionLabel: ({ name }: Site) => name,
        getOptionValue: ({ id }: Site) => id,
        valueFormatter: ({ value }) => customerSites.find((site) => site.id === value)?.name ?? t("noSelection"),
      },
      {
        field: "routeId",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.route"),
        flex: 3,
        sortable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: ["EMPTY", ...(routesQuery.data?.routes ?? [])],
        getOptionLabel: ({ name }: Route) => name ?? t("noSelection"),
        getOptionValue: ({ id }: Route) => id,
        valueFormatter: ({ value }) =>
          routesQuery.data?.routes.find((route) => route.id === value)?.name ?? t("noSelection"),
      },
      {
        field: "date",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.date"),
        flex: 1,
        sortable: false,
        valueGetter: ({ row: { routeId } }) => {
          const departureTime = routesQuery.data?.routes.find((route) => route.id === routeId)?.departureTime;
          if (!departureTime) return "";

          return DateTime.fromJSDate(departureTime).toFormat("dd-MM-yyyy");
        },
      },
    ],
    [t, customerSites, routesQuery],
  );

  return (
    <GenericDataGrid
      editMode="row"
      processRowUpdate={processRowUpdate}
      onCellClick={handleCellClick}
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModelsChange}
      rows={tasks}
      columns={columns}
      hideFooter
      disableRowSelectionOnClick
    />
  );
};

export default FreightTasks;
