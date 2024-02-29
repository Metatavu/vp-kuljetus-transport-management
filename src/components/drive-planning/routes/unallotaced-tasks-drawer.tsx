import { Collapse } from "@mui/material";
import { GridColDef, GridRow, GridRowProps, useGridApiRef } from "@mui/x-data-grid";
import { useQueries } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import DialogHeader from "components/generic/dialog-header";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import DataValidation from "utils/data-validation-utils";
import LocalizationUtils from "utils/localization-utils";
import { AssignmentSharp, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Site, Task } from "generated/client";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useCallback } from "react";

type Props = {
  open: boolean;
  tasks: Task[];
  sites: Site[];
  onClose: () => void;
};

const UnallocatedTasksDrawer = ({ open, tasks, sites, onClose }: Props) => {
  const { freightsApi, freightUnitsApi } = useApi();
  const { t } = useTranslation();
  const dataGridRef = useGridApiRef();

  const { isOver, setNodeRef, active } = useDroppable({
    id: "unallocated-tasks-droppable",
  });

  const { draggableType } = active?.data.current ?? {};

  const freightsQueries = useQueries({
    queries:
      tasks.map((task) => ({
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

  const getFilteredTasks = () => tasks.filter((task) => !task.routeId) ?? [];

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
  ];

  const renderDraggableDataGridRow = useCallback(
    (params: GridRowProps) => {
      const { attributes, listeners, setNodeRef } = useDraggable({
        id: params.rowId,
        data: {
          draggableType: "unallocatedTask",
          task: tasks.find((task) => task.id === params.rowId),
        },
      });

      return <GridRow {...params} {...attributes} {...listeners} ref={setNodeRef} style={{ cursor: "grab" }} />;
    },
    [tasks],
  );

  return (
    <Collapse
      in={open}
      collapsedSize={42}
      sx={{ maxHeight: "30%", overflowY: "scroll", scrollbarWidth: 0, "::-webkit-scrollbar": { display: "none" } }}
    >
      <DialogHeader
        title={t("drivePlanning.routes.unallocatedTasksTable.title")}
        StartIcon={AssignmentSharp}
        CloseIcon={open ? ExpandMore : ExpandLess}
        onClose={onClose}
      />
      <div ref={setNodeRef}>
        {isOver && draggableType === "groupedTask" && (
          <div
            style={{
              backgroundColor: "rgb(78, 138, 156, 0.6)",
              position: "absolute",
              width: "100%",
              height: dataGridRef.current.rootElementRef?.current?.clientHeight,
              overflow: "hidden",
              textAlign: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          />
        )}
        <GenericDataGrid
          apiRef={dataGridRef}
          columns={columns}
          rows={getFilteredTasks()}
          disableRowSelectionOnClick
          slots={{
            row: renderDraggableDataGridRow,
          }}
        />
      </div>
    </Collapse>
  );
};

export default UnallocatedTasksDrawer;
