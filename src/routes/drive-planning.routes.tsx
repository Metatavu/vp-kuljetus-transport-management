import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { GridColDef, GridPaginationModel, GridRow } from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import { GridStateColDef } from "@mui/x-data-grid/internals";

export const Route = createFileRoute("/drive-planning/routes")({
  component: DrivePlanningRoutes,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.title",
  }),
});

function DrivePlanningRoutes() {
  const { routesApi } = useApi();
  const { t } = useTranslation();

  const [date, setDate] = useState<DateTime>(DateTime.now());

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [totalResults, setTotalResults] = useState(0);

  const routesQuery = useQuery({
    queryKey: ["routes", date],
    queryFn: async () => {
      const [routes, headers] = await routesApi.listRoutesWithHeaders({
        departureAfter: date.startOf("day").toJSDate(),
        departureBefore: date.endOf("day").toJSDate(),
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");
      setTotalResults(count);
      return [
        {
          id: "1",
          name: "Test",
          truckId: "Test",
          driverId: "Test",
          departureTime: new Date(),
        },
      ];
    },
  });

  const minusOneDay = (currentDate: DateTime | null) => {
    if (currentDate === null) return DateTime.now().minus({ day: 1 });
    return currentDate?.minus({ day: 1 });
  };

  const plusOneDay = (currentDate: DateTime | null) => {
    if (currentDate === null) return DateTime.now().plus({ day: 1 });
    return currentDate?.plus({ day: 1 });
  };

  const onChangeDate = (newDate: DateTime | null) => {
    setDate(newDate ?? DateTime.now());
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Reitti",
        sortable: false,
        flex: 0.25,
      },
      {
        field: "tasks",
        headerName: "Tehtävät",
        sortable: false,
        flex: 0.5,
        renderCell: () => 5,
      },
      {
        field: "truckId",
        headerName: "Auto",
        sortable: false,
        flex: 0.5,
      },
      {
        field: "driverId",
        headerName: "Kuljettaja",
        sortable: false,
        flex: 5,
      },
      {
        field: "actions",
        type: "actions",
        flex: 1,
        renderHeader: () => null,
        renderCell: ({ id }) => (
          <Stack direction="row" spacing={1}>
            <Button variant="text" color="primary" size="small">
              {t("open")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t],
  );

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow
        leftToolbar={
          <Stack direction="row">
            <Typography variant="h6" sx={{ opacity: 0.6 }} alignSelf="center">
              Päivämäärä
            </Typography>
            <IconButton onClick={() => setDate(minusOneDay)}>
              <ArrowBack />
            </IconButton>
            <DatePicker value={date} onChange={onChangeDate} format="d.M.y" />
            <IconButton onClick={() => setDate(plusOneDay)}>
              <ArrowForward />
            </IconButton>
          </Stack>
        }
        toolbarButtons={
          <Button size="small" variant="text" startIcon={<Add />}>
            Uusi reitti
          </Button>
        }
      />
      <LoaderWrapper loading={routesQuery.isLoading}>
        <GenericDataGrid
          rows={routesQuery?.data ?? []}
          columns={columns}
          rowCount={totalResults}
          disableRowSelectionOnClick
          autoHeight={false}
          paginationMode="server"
          slots={{
            row: (test) => {
              const nameColumn = test.renderedColumns.find((col: any) => col.field === "name");
              const tasksColumn = test.renderedColumns.find((col: any) => col.field === "tasks");
              const truckColumn = test.renderedColumns.find((col: any) => col.field === "truckId");
              const driverColumn = test.renderedColumns.find((col: any) => col.field === "driverId");
              const actionsColumn = test.renderedColumns.find((col: any) => col.field === "actions");
              const [expanded, setExpanded] = useState(false);
              const columnsLength = test.renderedColumns.length;
              const actionsCell = test.renderedColumns[columnsLength - 1];
              if (actionsCell) {
                actionsCell.renderCell = () => (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setExpanded(!expanded);
                      }}
                    >
                      {t("open")}
                    </Button>
                  </Stack>
                );
              }
              (test.renderedColumns as GridStateColDef[]).splice(columnsLength - 1, 1, actionsCell);
              return (
                <Box>
                  <GridRow {...test} />
                  <Collapse
                    in={expanded}
                    sx={{ "& .MuiCollapse-wrapper": { marginLeft: `${nameColumn.computedWidth}px` } }}
                  >
                    <Table sx={{ border: "1px solid #4E8A9C" }}>
                      <TableHead
                        sx={{
                          "& .MuiTableCell-root": {
                            padding: "4px 8px",
                            backgroundColor: "rgb(237, 243, 245)",
                            borderRight: "1px solid #E0E0E0",
                          },
                        }}
                      >
                        <TableCell width={tasksColumn.computedWidth}>Tehtävä</TableCell>
                        <TableCell width={truckColumn.computedWidth}>Tunnus</TableCell>
                        <TableCell width={driverColumn.computedWidth / 2}>Asiakaspaikka</TableCell>
                        <TableCell width={driverColumn.computedWidth / 2}>Osoite</TableCell>
                        <TableCell>Tehtävien lkm</TableCell>
                        <TableCell width={tasksColumn.computedWidth / 5}>
                          <span />
                        </TableCell>
                      </TableHead>
                    </Table>
                  </Collapse>
                </Box>
              );
            },
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </LoaderWrapper>
    </Paper>
  );
}
