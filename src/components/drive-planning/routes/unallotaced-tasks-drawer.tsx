import { Collapse } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import DialogHeader from "components/generic/dialog-header";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import DataValidation from "utils/data-validation-utils";
import LocalizationUtils from "utils/localization-utils";
import { AssignmentSharp, ExpandLess, ExpandMore } from "@mui/icons-material";
import DraggableUnallocatedTaskRow from "./draggable-unallocated-task-row";
import { Site, Task } from "generated/client";

type Props = {
  open: boolean;
  tasks: Task[];
  sites: Site[];
  onClose: () => void;
};

const UnallocatedTasksDrawer = ({ open, tasks, sites, onClose }: Props) => {
  const { freightsApi, freightUnitsApi } = useApi();
  const { t } = useTranslation();

  const freightsQuery = useQuery({
    queryKey: ["freights"],
    queryFn: () => freightsApi.listFreights(),
  });

  const freightUnitsQueries = useQueries({
    queries:
      freightsQuery.data?.map((freight) => ({
        queryKey: ["freightUnits", freight.id],
        queryFn: () => freightUnitsApi.listFreightUnits({ freightId: freight.id }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const getFilteredTasks = () => tasks.filter((task) => !task.routeId);

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
        freightsQuery.data?.find((freight) => freight.id === freightId)?.freightNumber,
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
      sx={{ maxHeight: "30%", overflowY: "scroll", scrollbarWidth: 0, "::-webkit-scrollbar": { display: "none" } }}
    >
      <DialogHeader
        title="Järjestelemättömät tehtävät"
        StartIcon={AssignmentSharp}
        CloseIcon={open ? ExpandMore : ExpandLess}
        onClose={onClose}
      />
      <GenericDataGrid
        columns={columns}
        rows={getFilteredTasks()}
        slots={{
          row: DraggableUnallocatedTaskRow,
        }}
      />
    </Collapse>
  );
};

export default UnallocatedTasksDrawer;
