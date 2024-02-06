import { Link, Stack, Typography, styled } from "@mui/material";
import { DataGrid, GridColDef, fiFI } from "@mui/x-data-grid";
import { useEffect, useState, FC } from "react";
import { useTranslation } from "react-i18next";

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useApi } from "../hooks/use-api";
import { Trailer, Truck, Vehicle } from "generated/client";
import { VehicleListColumns } from "../types";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .vehicleList': {
    backgroundColor: "red"

  }
}));

/**
 * Form replies screen component
 */
const VehicleListScreen: FC = () => {
  //const { vehiclesApi, trucksApi, trailersApi } = useApi();

  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
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
    const vehicleListColumns = Object.values(t("vehicleListScreen.vehicleList.headings", { returnObjects: true }));

    const gridColumns = vehicleListColumns.map<GridColDef>(column => {
      const columnName = column ?? "";
      return ({
        field: columnName,
        headerName: column,
        allowProps: true,
        flex: 1,
        type: "string",
        renderHeader: params => {
          return (
            <Stack direction="row">
              <Typography fontWeight={"bold"} fontSize={14}>{params.colDef.headerName}</Typography>
            </Stack>
          );
        },
        renderCell: params => {
          switch (columnName) {
            case t("vehicleListScreen.vehicleList.headings.type"):
              return (
                <Stack>
                  <LocalShippingIcon />
                </Stack>
              );
            case t("vehicleListScreen.vehicleList.headings.plateNumber"):
              return (
                <Stack sx={{ background: "black" }}>
                  <Link href={"/vehicle-list"}>{params.row["plateNumber"]}</Link>
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
    const row: { [key: string]: string | number } = {};

    row.id = truck.id!;
    row.plateNumber = truck.plateNumber;
    row.name = "Volvo"
    row.type = t("vehicleListScreen.vehicleList.headings.type");
    return row;
  };

  /**
   * Load data for the table
   */
  const loadData = async () => {
    setLoading(true);

    try {
      //const vehicles = await vehiclesApi.listVehiclesWithHeaders({ first: page * resultsPerPage, max: resultsPerPage });
      //console.log(vehicles);
      //const trucks: Truck[] = await trucksApi.listTrucks();
      //const trailers: Trailer[] = await trailersApi.listTrailers();
      const vehicles: Vehicle[] = [{ id: "0001", truckId: "1234", trailerIds: ["5678"] }];
      const trucks: Truck[] = [
        { id: "1234-3", plateNumber: "ABC-123" },
        { id: "5678-2", plateNumber: "DEF-456" },
        { id: "9101-1", plateNumber: "GHI-789" }
      ];
      const trailers: Trailer[] = [{ id: "5678", plateNumber: "DEF-456" }, { id: "9101", plateNumber: "GHI-789" }, { id: "1121", plateNumber: "JKL-101" }];

      const vehicleRows = trucks.map((truck) => buildRow(truck));
      console.log(vehicleRows)
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
    <StyledDataGrid
      getRowClassName={() => `vehicleList`}
      showCellVerticalBorder
      showColumnVerticalBorder
      disableColumnMenu
      disableColumnSelector
      localeText={fiFI.components.MuiDataGrid.defaultProps.localeText}
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