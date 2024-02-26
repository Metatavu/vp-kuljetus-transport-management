import { Link, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, FC } from "react";
import { useTranslation } from "react-i18next";

import { useApi } from "hooks/use-api";
import { Truck } from "generated/client";
import GenericDataGrid from "./generic/generic-data-grid";
import { VehicleListColumns } from "../types";
import { useNavigate } from "@tanstack/react-router";

/**
 * Form replies screen component
 */
const VehicleListScreen: FC = () => {
  const { trucksApi } = useApi();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  //const [vehicles, setVehicles] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsPerPage = 25;
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  /**
   * Builds the columns for the table
   *
   * @returns grid columns
   */
  const setGridColumns = async () => {
    const vehicleListColumns = Object.values(VehicleListColumns);
    const gridColumns = vehicleListColumns.map<GridColDef>(column => {
      const columnName = column ?? "";

      return ({
        field: columnName,
        headerName: t(`vehicleListScreen.vehicleList.headings.${columnName}`),
        allowProps: true,
        flex: 1,
        type: "string",
        renderHeader: params => (
          <Stack direction="row">
            <Typography fontWeight={"bold"} fontSize={14}>{params.colDef.headerName}</Typography>
          </Stack>
        ),
        renderCell: params => {
          switch (columnName) {
            case VehicleListColumns.Name:
              return (
                <Stack>
                  <Link onClick={() => navigate({ to: `/vehicle-info`, params: { id: params.row.id } })}>{params.row["name"]}</Link>
                </Stack>
              );
            default:
              return (
                <Stack direction="row">
                  <Typography>{params.row[column]}</Typography>
                </Stack>
              );
          }
        }
      });
    });

    setColumns(gridColumns);
  };

  /**
   * Builds vehicle row for the table
   *
   * @param vehicles - vehicles
   */
  const buildRow = (truck: Truck) => {
    return {
      id: truck.id,
      name: truck.plateNumber,
      number: truck.vin,
      address: "-",
      location: "-",
      status: "-",
      trailer: "-",
      driver: "-"
    } as const;
  };

  /**
   * Load data for the table
   */
  const loadData = async () => {
    setLoading(true);

    try {
      const trucks = await trucksApi.listTrucks({});
      const vehicleRows = trucks.map(buildRow);

      setTotalResults(50);
      setRows(vehicleRows);
      await setGridColumns();
    } catch (e) {
      console.error(t("errorHandling.vehicleListing"));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <GenericDataGrid
      showCellVerticalBorder
      showColumnVerticalBorder
      disableColumnSelector
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={row => row.id}
      pagination
      paginationMode="server"
      pageSizeOptions={[25, 50, 100]}
      rowCount={totalResults}
      paginationModel={{ page, pageSize: resultsPerPage }}
      onPaginationModelChange={newModel => { setPage(newModel.page) }}
    />
  );
};

export default VehicleListScreen;