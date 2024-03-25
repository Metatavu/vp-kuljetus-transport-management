import { SortableContext } from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import UnallocatedTaskTableRow from "./unallocated-task-table-row";
import { useDroppable } from "@dnd-kit/core";
import { DraggableType, DroppableType } from "../../../types";
import DataValidation from "utils/data-validation-utils";
import { QUERY_KEYS, useTasks } from "hooks/use-queries";
import { useQueries } from "@tanstack/react-query";
import { useApi } from "hooks/use-api";
import { useTranslation } from "react-i18next";
import { Site } from "generated/client";
import { useState } from "react";

type Props = {
  sites: Site[];
};

const UnallocatedTasksTable = ({ sites }: Props) => {
  const { t } = useTranslation();
  const { freightsApi, freightUnitsApi } = useApi();
  const { isOver, setNodeRef, active } = useDroppable({
    id: DroppableType.UNALLOCATED_TASKS_DROPPABLE,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(25);

  const { draggableType } = active?.data.current ?? {};

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

  return (
    <div ref={setNodeRef} style={{ minHeight: "30%" }}>
      {isOver && draggableType === DraggableType.GROUPED_TASK && (
        <div
          style={{
            backgroundColor: "rgb(78, 138, 156, 0.6)",
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            textAlign: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        />
      )}
      {/* <SortableContext
      strategy={}
        items={
          tasksQuery.data?.tasks.map((task) => task.id).filter(DataValidation.validateValueIsNotUndefinedNorNull) ?? []
        }
      > */}
      <TableContainer sx={{ minHeight: "300px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
              <TableCell>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
              <TableCell>{t("drivePlanning.routes.unallocatedTasksTable.freightNumber")}</TableCell>
              <TableCell>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
              <TableCell>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
              <TableCell>{t("drivePlanning.routes.unallocatedTasksTable.contents")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksQuery.data?.tasks.map((task) => {
              const { freightNumber } = freightsQueries.data?.find((freight) => freight.id === task.freightId) ?? {};
              const { name, address } = sites.find((site) => site.id === task.customerSiteId) ?? {};
              const freightUnitsContents = freightUnitsQueries.data
                ?.filter((freightUnit) => freightUnit.freightId === task.freightId)
                .map((freightUnit) => freightUnit.contents)
                .filter((content) => content)
                .join(", ");

              return (
                <UnallocatedTaskTableRow
                  key={task.id}
                  task={task}
                  freightNumber={freightNumber ?? 0}
                  name={name ?? ""}
                  address={address ?? ""}
                  freightUnitsContents={freightUnitsContents}
                />
              );
            })}
          </TableBody>
          <TableFooter>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={tasksQuery.data?.totalResults ?? 0}
              page={currentPage}
              rowsPerPage={currentRowsPerPage}
              onRowsPerPageChange={(event) => setCurrentRowsPerPage(parseInt(event.target.value, 10))}
              onPageChange={(_, page) => setCurrentPage(page)}
            />
          </TableFooter>
        </Table>
      </TableContainer>
      {/* </SortableContext> */}
    </div>
  );
};

export default UnallocatedTasksTable;
