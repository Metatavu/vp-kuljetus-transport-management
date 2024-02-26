import GenericDataGrid from "components/generic/generic-data-grid";
import { useApi } from "hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { GridCellParams, GridColDef, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";
import { Site, Task } from "generated/client";
import { DateTime } from "luxon";

type Props = {
  customerSites: Site[];
  tasks: Task[];
  onEditTask: (task: Task) => void;
};

const FreightTasks = ({ tasks, customerSites, onEditTask }: Props) => {
  const { t } = useTranslation();
  const { routesApi } = useApi();

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const routesQuery = useQuery({
    queryKey: ["routes"],
    queryFn: () => {
      const yesterday = DateTime.now().minus({ days: 1 }).toJSDate();
      return routesApi.listRoutes({ departureAfter: yesterday });
    },
  });

  const handleRowModelsChange = useCallback((newModel: GridRowModesModel) => setRowModesModel(newModel), []);

  const processRowUpdate = (newRow: Task) => {
    onEditTask(newRow);
    return newRow;
  };

  const handleCellClick = useCallback((params: GridCellParams) => {
    if (!params.isEditable) return;
    setRowModesModel((previousModel) => ({
      ...Object.keys(previousModel).reduce(
        (acc, id) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [id]: { mode: GridRowModes.View },
        }),
        {},
      ),
      [params.row.id]: { mode: GridRowModes.Edit },
    }));
  }, []);

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
      },
      {
        field: "routeId",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.route"),
        flex: 3,
        sortable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: routesQuery.data?.map((route) => route.id) ?? [],
        getOptionLabel: (option) => routesQuery.data?.find((route) => route.id === option)?.name,
        getOptionValue: (option) => option,
        valueGetter: ({ row: { routeId } }) => routesQuery.data?.find((route) => route.id === routeId)?.name,
      },
      {
        field: "date",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.date"),
        flex: 1,
        sortable: false,
        valueGetter: ({ row: { routeId } }) => {
          const departureTime = routesQuery.data?.find((route) => route.id === routeId)?.departureTime;
          if (!departureTime) return "";

          return DateTime.fromJSDate(departureTime).toLocaleString(DateTime.DATE_SHORT);
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
