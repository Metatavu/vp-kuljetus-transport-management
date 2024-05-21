import { Collapse, Stack } from "@mui/material";
import { GridColDef, GridCellParams } from "@mui/x-data-grid";
import { useQueries } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import DialogHeader from "components/generic/dialog-header";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import DataValidation from "utils/data-validation-utils";
import LocalizationUtils from "utils/localization-utils";
import { AssignmentSharp, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Site, Task } from "generated/client";
import { useNavigate } from "@tanstack/react-router";
import { QUERY_KEYS, useTasks } from "hooks/use-queries";
import { useMemo } from "react";

type Props = {
  open: boolean;
  sites: Site[];
  onClose: () => void;
};

const UnallocatedTasksDrawer = ({ open, sites, onClose }: Props) => {
  const { freightsApi, freightUnitsApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/drive-planning/routes" });

  const tasksQuery = useTasks({ assignedToRoute: false });

  const getDistinctFreights = () => [...new Set((tasksQuery.data?.tasks ?? []).map((task) => task.freightId))];

  const freightsQueries = useQueries({
    queries:
      getDistinctFreights().map((freightId) => ({
        queryKey: [QUERY_KEYS.FREIGHTS, freightId],
        queryFn: () => freightsApi.findFreight({ freightId: freightId }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const freightUnitsQueries = useQueries({
    queries:
      freightsQueries.data?.map((freight) => ({
        queryKey: [QUERY_KEYS.FREIGHT_UNITS_BY_FREIGHT, freight.id],
        queryFn: () => freightUnitsApi.listFreightUnits({ freightId: freight.id }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const columns: GridColDef[] = useMemo(
    () => [
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
        flex: 3,
        renderCell: ({ row: { freightId } }) =>
          freightsQueries.data?.find((freight) => freight.id === freightId)?.freightNumber,
      },
      {
        field: "customerSiteId",
        headerName: t("drivePlanning.routes.tasksTable.customerSite"),
        sortable: false,
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
        flex: 2,
        renderCell: ({ row: { freightId } }) => {
          const freightUnits = freightUnitsQueries.data?.filter((freightUnit) => freightUnit.freightId === freightId);

          return freightUnits
            ?.map((freightUnit) => freightUnit.contents)
            .filter((content) => content)
            .join(", ");
        },
      },
    ],
    [sites, t, freightsQueries.data, freightUnitsQueries.data],
  );
  return (
    <Collapse in={open} collapsedSize={42}>
      <Stack direction="column" height={360}>
        <DialogHeader
          title={t("drivePlanning.routes.unallocatedTasksTable.title")}
          closeTooltip={t(`drivePlanning.routes.unallocatedTasksTable.${open ? "minify" : "expand"}TasksDrawer`)}
          StartIcon={AssignmentSharp}
          CloseIcon={open ? ExpandMore : ExpandLess}
          onClose={onClose}
        />
        <GenericDataGrid
          fullScreen
          autoHeight={false}
          columns={columns}
          rows={tasksQuery.data?.tasks ?? []}
          loading={tasksQuery.isFetching}
          rowCount={tasksQuery.data?.totalResults ?? 0}
          onCellClick={({ row: { freightId } }: GridCellParams<Task>) =>
            navigate({ search: { freightId: freightId, date: undefined } })
          }
        />
      </Stack>
    </Collapse>
  );
};

export default UnallocatedTasksDrawer;
