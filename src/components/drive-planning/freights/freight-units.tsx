import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deepEqual } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import { FreightUnit } from "generated/client";
import { useCreateFreightUnit } from "hooks/use-mutations";
import { QUERY_KEYS } from "hooks/use-queries";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

const FREIGHT_UNIT_TYPES = [
  "EUR",
  "FIN",
  "RLK",
  "PEU",
  "DOLL",
  "CCRLK",
  "PMLA",
  "MLA",
  "QTR",
  "MDL",
  "MRLK",
  "TN",
  "KG",
] as const;

type Props = {
  freightUnits: FreightUnit[];
  freightId: string;
  onEditFreightUnit: (freightUnit: FreightUnit) => void;
};

const FreightUnits = ({ freightUnits, freightId, onEditFreightUnit }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { rowModesModel, handleCellClick, handleRowModelsChange } = useSingleClickRowEditMode();

  const createFreightUnit = useCreateFreightUnit();

  const deleteFreightUnit = useMutation({
    mutationFn: (id: string) => api.freightUnits.deleteFreightUnit({ freightUnitId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS] });
    },
  });

  const onAddNewFreightUnit = useCallback(
    () => createFreightUnit.mutate({ freightId, type: FREIGHT_UNIT_TYPES[0] }),
    [freightId, createFreightUnit],
  );

  const processRowUpdate = useCallback(
    (newRow: FreightUnit, oldRow: FreightUnit) => {
      if (deepEqual(oldRow, newRow)) return oldRow;
      onEditFreightUnit(newRow);
      return newRow;
    },
    [onEditFreightUnit],
  );

  const parseEditCellNumberValue = useCallback((value: unknown) => {
    if (value === null || value === undefined || value === "") return undefined;

    return parseFloat(value as string);
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
        valueParser: parseEditCellNumberValue,
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
    [t, deleteFreightUnit, parseEditCellNumberValue],
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
        onClick={onAddNewFreightUnit}
      >
        {t("drivePlanning.freightUnits.addRow")}
      </Button>
    </>
  );
};

export default FreightUnits;
