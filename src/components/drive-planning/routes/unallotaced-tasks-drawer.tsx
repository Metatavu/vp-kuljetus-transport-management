import { Collapse } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import DialogHeader from "components/styled/dialog-header";
import { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import DataValidation from "utils/data-validation-utils";
import LocalizationUtils from "utils/localization-utils";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

type Props = {
  open: boolean;
  onClose: () => void;
};

const UnallocatedTasksDrawer = forwardRef(({ open, onClose }: Props, ref: ForwardedRef<HTMLDivElement>) => {
  const { tasksApi, freightsApi, freightUnitsApi, sitesApi } = useApi();
  const { t } = useTranslation();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.listTasks(),
    select: (data) => data.filter((task) => !task.routeId),
  });

  const freightsQueries = useQueries({
    queries:
      tasksQuery.data?.map((task) => ({
        queryKey: ["freights", task.freightId],
        queryFn: () => freightsApi.findFreight({ freightId: task.freightId }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const freightUnitsQueries = useQueries({
    queries:
      freightsQueries.data?.map((freight) => ({
        queryKey: ["freightUnits", freight.id],
        queryFn: () => freightUnitsApi.listFreightUnits({ freightId: freight.id }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const sitesQuery = useQueries({
    queries:
      tasksQuery.data?.map((task) => ({
        queryKey: ["sites", task.customerSiteId],
        queryFn: () => sitesApi.findSite({ siteId: task.customerSiteId }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const columns: GridColDef[] = [
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
      headerName: "Rahtikirja",
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
      renderCell: ({ row: { customerSiteId } }) => sitesQuery.data?.find((site) => site.id === customerSiteId)?.name,
    },
    {
      field: "address",
      headerName: t("drivePlanning.routes.tasksTable.address"),
      sortable: false,
      flex: 3,
      renderCell: ({ row: { customerSiteId } }) => sitesQuery.data?.find((site) => site.id === customerSiteId)?.address,
    },
    {
      field: "contents",
      headerName: "Rahti",
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
  ];
  return (
    <Collapse
      in={open}
      collapsedSize={42}
      ref={ref}
      sx={{ maxHeight: "30%", overflowY: "scroll", scrollbarWidth: 0, "::-webkit-scrollbar": { display: "none" } }}
    >
      <DialogHeader title="Järjestelemättömät tehtävät" onClose={onClose} CloseIcon={open ? ExpandMore : ExpandLess} />
      <GenericDataGrid columns={columns} rows={tasksQuery.data ?? []} />
    </Collapse>
  );
});

export default UnallocatedTasksDrawer;
