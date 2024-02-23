import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { GridCellParams, GridColDef, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import { FreightUnit } from "generated/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";

const FREIGHT_UNIT_TYPES = ["EUR", "FIN", "RLK"] as const;

type Props = {
  freightUnits: FreightUnit[];
  freightId: string;
  onEditFreightUnit: (freightUnit: FreightUnit) => void;
};

const FreightUnits = ({ freightUnits, freightId, onEditFreightUnit }: Props) => {
  const { t } = useTranslation();
  const { freightUnitsApi } = useApi();
  const queryClient = useQueryClient();

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const createFreightUnit = useMutation({
    mutationFn: async () =>
      await freightUnitsApi.createFreightUnit({
        freightUnit: {
          freightId: freightId,
          type: "EUR",
        },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["freightUnits", freightId] }),
  });

  const deleteFreightUnit = useMutation({
    mutationFn: async (id: string) => await freightUnitsApi.deleteFreightUnit({ freightUnitId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freightUnits", freightId] });
      queryClient.fetchQuery({ queryKey: ["freightUnits", freightId] });
    },
  });

  const handleRowModelsChange = useCallback((newModel: GridRowModesModel) => setRowModesModel(newModel), []);

  const processRowUpdate = (newRow: FreightUnit) => {
    onEditFreightUnit(newRow);
    return newRow;
  };

  const handleCellClick = useCallback((params: GridCellParams) => {
    if (!params.isEditable) return;
    setRowModesModel((previousModel) => ({
      ...Object.keys(previousModel).reduce(
        (acc, id) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [id]: { mode: GridRowModes.View },
        }),
        {},
      ),
      [params.row.id]: { mode: GridRowModes.Edit },
    }));
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "type",
        headerAlign: "center",
        headerName: t("drivePlanning.freightUnits.type"),
        sortable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: FREIGHT_UNIT_TYPES,
        flex: 1,
      },
      {
        field: "quantity",
        headerAlign: "center",
        headerName: t("drivePlanning.freightUnits.quantity"),
        sortable: false,
        editable: true,
        type: "number",
        align: "left",
        flex: 1,
      },
      {
        field: "contents",
        headerAlign: "center",
        headerName: t("drivePlanning.freightUnits.content"),
        sortable: false,
        flex: 3,
        editable: true,
        type: "string",
      },
      {
        field: "actions",
        type: "actions",
        headerAlign: "center",
        headerName: t("actions"),
        sortable: false,
        renderCell: ({ row: { id } }) => (
          <Button variant="text" color="error" size="small" onClick={() => deleteFreightUnit.mutate(id)}>
            {t("delete")}
          </Button>
        ),
      },
    ],
    [t, deleteFreightUnit],
  );

  return (
    <>
      <GenericDataGrid
        editMode="row"
        processRowUpdate={processRowUpdate}
        onCellClick={handleCellClick}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModelsChange}
        columns={columns}
        rows={freightUnits}
        hideFooter
        disableRowSelectionOnClick
      />
      <Button
        variant="text"
        color="primary"
        size="small"
        startIcon={<Add />}
        sx={{ alignSelf: "flex-end" }}
        onClick={() => createFreightUnit.mutate()}
      >
        {t("drivePlanning.freightUnits.addRow")}
      </Button>
    </>
  );
};

export default FreightUnits;
