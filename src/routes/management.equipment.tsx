import { Add } from "@mui/icons-material";
import { Button, Stack, styled } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { Towable, Truck } from "generated/client";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "src/types";
import LocalizationUtils from "utils/localization-utils";

export const Route = createFileRoute("/management/equipment")({
  component: ManagementEquipment,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("management.title") }, { label: t("management.equipment.title") }];
    return { breadcrumbs };
  },
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
  const navigate = useNavigate();

  const [totalTruckResults, setTotalTruckResults] = useState(0);
  const [totalTowableResults, setTotalTowableResults] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const listTrucksQuery = useQuery({
    queryKey: ["trucks", paginationModel],
    queryFn: async () => {
      const [trucks, headers] = await api.trucks.listTrucksWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");

      setTotalTruckResults(count);
      return trucks;
    },
  });

  const listTowablesQuery = useQuery({
    queryKey: ["towables", paginationModel],
    queryFn: async () => {
      const [towables, headers] = await api.towables.listTowablesWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");

      setTotalTowableResults(count);
      return towables;
    },
  });

  const trucks = useMemo(() => listTrucksQuery.data ?? [], [listTrucksQuery]);
  const towables = useMemo(() => listTowablesQuery.data ?? [], [listTowablesQuery]);
  const equipment = useMemo(() => [...trucks, ...towables], [trucks, towables]);

  const columns = useMemo<GridColDef<Truck | Towable>[]>(
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
        valueGetter: ({ row: { type } }) => LocalizationUtils.getLocalizedEquipmentType(type, t),
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
        renderCell: ({ row: { id, type } }) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => {
                if (!id) return;
                const equipmentType = type === "TRUCK" || type === "SEMI_TRUCK" ? "truck" : "towable";

                navigate(
                  equipmentType === "truck"
                    ? {
                        to: "/management/equipment/truck/$truckId/modify",
                        params: { truckId: id },
                      }
                    : {
                        to: "/management/equipment/towable/$towableId/modify",
                        params: { towableId: id },
                      },
                );
              }}
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
          rows={equipment}
          columns={columns}
          pagination
          showCellVerticalBorder
          showColumnVerticalBorder
          disableColumnSelector
          loading={false}
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
