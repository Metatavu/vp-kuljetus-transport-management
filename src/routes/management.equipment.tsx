import { Button, Paper, Stack } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Add } from "@mui/icons-material";
import { useApi } from "../../src/hooks/use-api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/management/equipment")({
  component: ManagementEquipment,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.title",
  }),
});

function ManagementEquipment() {
  const { t } = useTranslation();
  const { trucksApi } = useApi();
  const navigate = useNavigate();

  const [totalResults, setTotalResults] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const trucks = useQuery({
    queryKey: ["trucks", paginationModel],
    queryFn: async () => {
      const [trucks, headers] = await trucksApi.listTrucksWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");
      setTotalResults(count);
      return trucks;
    },
  });

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
          to: "/management/equipment/add-equipment",
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
        loading={false}
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
