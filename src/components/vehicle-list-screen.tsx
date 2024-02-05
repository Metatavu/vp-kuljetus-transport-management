import { Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, fiFI } from "@mui/x-data-grid";
import { useParams } from "@tanstack/react-router";
import React, { useContext, useEffect, useState, FC } from "react";
import { useTranslation } from "react-i18next";


/**
 * Form replies screen component
 */
const VehicleListScreen: FC = () => {

  //const apiClient = useApiClient(Api.getApiClient);
  //const {  } = apiClient;

  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsPerPage = 24;
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  //const useparams = useParams();

  /**
   * Builds the columns for the table
   *
   * @returns grid columns
   */
  const setGridColumns = async () => {
    const vehicleListColumns = ["TYYPPI", "NIMI", "TUNNUS", "LÄMPÖTILA", "OSOITE", "SIJAINTI", "TILA", "HUOLTO", "KALUSTO/LÄMPÖTILA", "KULJETTAJA"];

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
            default:
              return (
                <Stack direction="row">
                  <Typography>{params.row[columnName]}</Typography>
                </Stack>
              );
          }
        }
      });
    });

    setColumns(gridColumns);
  };

  /**
   * Builds a row for the table
   *
   * @param reply reply
   */
  const buildRow = () => {
    const row: { [key: string]: string | number } = { "id": "1234", "TYYPPI": "Epä-Kuorma-auto", "NIMI": "Volvo", "TUNNUS": "ABC-123", "LÄMPÖTILA": "0", "OSOITE": "Kuormatie 1", "SIJAINTI": "Kuormatie 1", "TILA": "Käytössä", "HUOLTO": "Ei", "KALUSTO/LÄMPÖTILA": "Ei", "KULJETTAJA": "Ei" };

    return row;
  };

  /**
   * Vehicles screen loadData
   */
  const loadData = async () => {
    setLoading(true);

    try {
      const vehicleRows = buildRow();
      setTotalResults(100);
      setRows([vehicleRows]);
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
    <DataGrid
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
      pageSizeOptions={[24]}
      rowCount={totalResults}
    //onPaginationModelChange={(newPage: number) => setPage(newPage)}
    //rowsPerPageOptions={[25]}
    />
  );
};

export default VehicleListScreen;