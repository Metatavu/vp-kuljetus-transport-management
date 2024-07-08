import { Button, Stack, styled } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Add } from "@mui/icons-material";
import { useApi } from "hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import LocalizationUtils from "utils/localization-utils";

export const Route = createFileRoute("/management/equipment")({
  component: ManagementEquipment,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.equipment.title"],
  }),
});

// Styled root component
const Root = styled(Stack, {
  label: "management-equipment-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

function ManagementEquipment() {
  const { t } = useTranslation();
  const { trucksApi, towablesApi } = useApi();
  const navigate = useNavigate();

  const [totalTruckResults, setTotalTruckResults] = useState(0);
  const [totalTowableResults, setTotalTowableResults] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  /**
   * NOTE: We need to figure out how to fetch both trucks and towables in a meaningful way
   */
  const trucks = useQuery({
    queryKey: ["trucks", paginationModel],
    queryFn: async () => {
      const [trucks, headers] = await trucksApi.listTrucksWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");

      setTotalTruckResults(count);
      return trucks;
    },
  });

  const towables = useQuery({
    queryKey: ["towables", paginationModel],
    queryFn: async () => {
      const [towables, headers] = await towablesApi.listTowablesWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");

      setTotalTowableResults(count);
      return towables;
    },
  });

  const trucksData = trucks.data ?? [];
  const towablesData = towables.data ?? [];

  // Combine trucks and towables
  const equipment = [...trucksData, ...towablesData];

  const localizedEquipment = equipment?.map((equipment) => {
    return {
      ...equipment,
      type: LocalizationUtils.getLocalizedEquipmentType(equipment.type, t),
    };
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerAlign: "center",
        headerName: t("management.equipment.number"),
        sortable: false,
        width: 150,
        align: "center",
      },
      {
        field: "plateNumber",
        headerAlign: "center",
        headerName: t("management.equipment.licensePlate"),
        sortable: false,
        width: 200,
        align: "center",
      },
      {
        field: "type",
        headerAlign: "left",
        headerName: t("management.equipment.type"),
        sortable: false,
        width: 400,
      },
      {
        field: "vin",
        headerAlign: "left",
        headerName: t("management.equipment.vin"),
        sortable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        width: 150,
        renderHeader: () => null,
        renderCell: ({ id }) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() =>
                navigate({
                  to: "/management/equipment/$equipmentId/modify",
                  params: { equipmentId: id as string },
                })
              }
            >
              {t("management.equipment.open")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, navigate],
  );

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      <Button
        onClick={() =>
          navigate({
            to: "/management/equipment/add-equipment",
          })
        }
        variant="contained"
        startIcon={<Add />}
      >
        {t("addNew")}
      </Button>
    </Stack>
  );

  return (
    <Root>
      <ToolbarRow title={t("management.equipment.title")} toolbarButtons={renderToolbarButtons()} />
      <Stack flex={1} sx={{ height: "100%", overflowY: "auto" }}>
        <GenericDataGrid
          fullScreen
          autoHeight={false}
          rows={localizedEquipment ?? []}
          columns={columns}
          pagination
          showCellVerticalBorder
          showColumnVerticalBorder
          disableColumnSelector
          loading={false}
          getRowId={(row) => `${row.id}-${equipment.find((e) => e.id === row.id)?.type}`}
          paginationMode="server"
          pageSizeOptions={[25, 50, 100]}
          rowCount={totalTruckResults + totalTowableResults}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Stack>
    </Root>
  );
}
