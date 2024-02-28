import { Button, Paper, Stack } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Add } from "@mui/icons-material";
import { useApi } from "../../src/hooks/use-api";
import { Towable, Truck } from "generated/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/management/equipment")({
  component: ManagementEquipment,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.title",
  }),
});

function ManagementEquipment() {
  const { t } = useTranslation();
  const { trucksApi, towablesApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsPerPage = 25;
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const trucks = useQuery({
    queryKey: ["sites", paginationModel],
    queryFn: async () => {
      const [sites, headers] = await trucksApi.listTrucksWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");
      setTotalResults(count);
      return sites;
    },
  });

  /**
   * Builds vehicle row for the table
   *
   * @param vehicles - vehicles
   */
  const buildRow = (equipment: Truck | Towable) => {
    return {
      id: equipment.id,
      number: equipment.id,
      plateNumber: equipment.plateNumber,
      type: equipment.type,
      vin: equipment.vin
    } as const;
  };

  /**
   * Load data for the table
   */
  const loadData = async () => {
    setLoading(true);

    try {
      const towables = await towablesApi.listTowables({});
      const trucks = await trucksApi.listTrucks({});

      const vehicleRows = [...trucks ?? [], ...towables ?? []].map(buildRow);

      setTotalResults(24);
      setRows(vehicleRows);
    } catch (e) {
      console.error(t("errorHandling.vehicleListing"));
    }

    setLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadData();
  }, [page]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "number",
        headerAlign: "center",
        headerName: t("management.equipment.number"),
        sortable: false,
        flex: 1,
      },
      {
        field: "plateNumber",
        headerAlign: "center",
        headerName: t("management.equipment.licensePlate"),
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerAlign: "center",
        headerName: t("management.equipment.type"),
        sortable: false,
        flex: 1,
      },
      {
        field: "vin",
        headerAlign: "center",
        headerName: t("management.equipment.vin"),
        sortable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        flex: 0.7,
        renderHeader: () => null,
        renderCell: () => (
          <Stack direction="row" spacing={1}>
            <Button variant="text" color="primary" size="small">
              {t("management.equipment.open")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t],
  );

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      <Button onClick={() =>
        navigate({
          to: "/management/equipment",
        })
      } variant="contained" startIcon={<Add />}>
        {t("addNew")}
      </Button>
    </Stack>
  );

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow title={t("management.equipment.title")} toolbarButtons={renderToolbarButtons()} />
      <GenericDataGrid
        rows={trucks.data ?? []}
        columns={columns}
        pagination
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnSelector
        loading={loading}
        getRowId={row => row.id}
        paginationMode="server"
        pageSizeOptions={[25, 50, 100]}
        rowCount={totalResults}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Paper>
  );
}
