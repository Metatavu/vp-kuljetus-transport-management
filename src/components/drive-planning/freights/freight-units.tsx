import { Add } from "@mui/icons-material";
import { Button, MenuItem, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import { FreightUnit } from "generated/client";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const FREIGHT_UNIT_TYPES = ["EUR", "FIN", "RLK"] as const;

const FreightUnits = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<FreightUnit[]>([]);

  const addFreightUnit = () => {
    setRows([...rows, { freightId: (Math.random() * 1000).toString(), type: "", quantity: 0, contents: "" }]);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "type",
        headerAlign: "center",
        headerName: t("drivePlanning.freightUnits.type"),
        sortable: false,
        flex: 1,
        renderCell: ({ row }) => (
          <TextField select>
            {FREIGHT_UNIT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        ),
      },
      {
        field: "quantity",
        headerAlign: "center",
        headerName: t("drivePlanning.freightUnits.quantity"),
        sortable: false,
        flex: 1,
        renderCell: ({ row }) => <TextField type="number" />,
      },
      {
        field: "contents",
        headerAlign: "center",
        headerName: t("drivePlanning.freightUnits.content"),
        sortable: false,
        flex: 3,
        renderCell: ({ row }) => <TextField />,
      },
      {
        field: "actions",
        type: "actions",
        headerAlign: "center",
        headerName: t("actions"),
        sortable: false,
        renderCell: () => (
          <Button variant="text" color="error" size="small">
            {t("delete")}
          </Button>
        ),
      },
    ],
    [t],
  );
  return (
    <>
      <GenericDataGrid
        columns={columns}
        rows={rows}
        hideFooter
        getRowId={(row) => row.freightId}
        disableRowSelectionOnClick
      />
      <Button
        variant="text"
        color="primary"
        size="small"
        startIcon={<Add />}
        sx={{ alignSelf: "flex-end" }}
        onClick={addFreightUnit}
      >
        {t("drivePlanning.freightUnits.addRow")}
      </Button>
    </>
  );
};

export default FreightUnits;
