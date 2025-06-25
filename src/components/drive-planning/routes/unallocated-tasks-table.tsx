import { DragHandle } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import type { GridColDef, GridRowProps } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import type { Site, Task } from "generated/client";
import { QUERY_KEYS, getListTasksQueryOptions } from "hooks/use-queries";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DataValidation from "utils/data-validation-utils";
import LocalizationUtils from "utils/localization-utils";
import type { UnallocatedTasksRowDragHandles } from "../../../types";
import DraggableUnallocatedTasksTableRow from "./draggable-unallocated-tasks-table-row";

type Props = {
  sites: Site[];
};

const UnallocatedTasksTable = ({ sites }: Props) => {
  const { t } = useTranslation();

  const navigate = useNavigate({ from: "/drive-planning/routes" });
  const [rowDragHandles, setRowDragHandles] = useState<UnallocatedTasksRowDragHandles>({});

  const tasksQuery = useQuery(getListTasksQueryOptions({ assignedToRoute: false, max: 100 }));

  const getDistinctFreightIds = () => [...new Set((tasksQuery.data?.tasks ?? []).map((task) => task.freightId))];

  const freightsQueries = useQueries({
    queries:
      getDistinctFreightIds().map((freightId) => ({
        queryKey: [QUERY_KEYS.FREIGHTS, freightId],
        queryFn: () => api.freights.findFreight({ freightId: freightId }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const freightUnitsQueries = useQueries({
    queries:
      freightsQueries.data?.map((freight) => ({
        queryKey: [QUERY_KEYS.FREIGHT_UNITS_BY_FREIGHT, freight.id],
        queryFn: () => api.freightUnits.listFreightUnits({ freightId: freight.id, max: 100 }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const columns: GridColDef<Task>[] = useMemo(
    () => [
      {
        field: "actions",
        type: "actions",
        width: 50,
        renderHeader: () => null,
        renderCell: ({ id }) => {
          const { setActivatorNodeRef, attributes, listeners } = rowDragHandles[id as string] ?? {};

          return (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              sx={{ cursor: "grab" }}
              {...attributes}
              {...listeners}
              title={t("drivePlanning.routes.unallocatedTasksTable.taskRowTooltip")}
            >
              <DragHandle />
            </IconButton>
          );
        },
      },
      {
        field: "taskType",
        headerName: t("drivePlanning.routes.tasksTable.task"),
        sortable: false,
        flex: 1,
        renderCell: ({ row: { type } }) => LocalizationUtils.getLocalizedTaskType(type, t),
      },
      {
        field: "groupNumber",
        headerName: t("drivePlanning.routes.tasksTable.groupNumber"),
        sortable: false,
        flex: 1,
      },
      {
        field: "freightNumber",
        headerName: t("drivePlanning.routes.unallocatedTasksTable.freightNumber"),
        sortable: false,
        flex: 1,
        renderCell: ({ row: { freightId } }) =>
          freightsQueries.data?.find((freight) => freight.id === freightId)?.freightNumber,
      },
      {
        field: "customerSiteId",
        headerName: t("drivePlanning.routes.tasksTable.customerSite"),
        sortable: true,
        flex: 3,
        renderCell: ({ row: { customerSiteId } }) => sites.find((site) => site.id === customerSiteId)?.name,
      },
      {
        field: "address",
        headerName: t("drivePlanning.routes.tasksTable.address"),
        sortable: false,
        flex: 3,
        renderCell: ({ row: { customerSiteId } }) => sites.find((site) => site.id === customerSiteId)?.address,
      },
      {
        field: "contents",
        headerName: t("drivePlanning.routes.unallocatedTasksTable.contents"),
        sortable: false,
        flex: 4,
        renderCell: ({ row: { freightId } }) => {
          const freightUnits = freightUnitsQueries.data?.filter((freightUnit) => freightUnit.freightId === freightId);

          return freightUnits
            ?.map((freightUnit) => freightUnit.contents)
            .filter((content) => content)
            .join(", ");
        },
      },
    ],
    [sites, t, freightsQueries.data, freightUnitsQueries.data, rowDragHandles],
  );

  const renderRow = useCallback((props: GridRowProps) => {
    return <DraggableUnallocatedTasksTableRow {...props} setRowDragHandles={setRowDragHandles} />;
  }, []);

  return (
    <GenericDataGrid
      fullScreen
      autoHeight={false}
      columns={columns}
      rows={tasksQuery.data?.tasks ?? []}
      rowCount={tasksQuery.data?.totalResults ?? 0}
      disableRowSelectionOnClick
      slots={{
        row: renderRow,
      }}
      onRowClick={({ row: { freightId } }) => {
        navigate({ search: { freightId, date: undefined } });
      }}
    />
  );
};

export default UnallocatedTasksTable;
