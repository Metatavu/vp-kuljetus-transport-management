import { GridCellModes, GridCellModesModel, GridCellParams } from "@mui/x-data-grid";
import { useState } from "react";

/**
 * A hook to toggle DataGrid cell edit mode on single click.
 *
 * Overrides default behaviour of DataGrid to enter edit mode on double click.
 *
 * @param onCellClick - Callback function to be called when a cell is clicked. This function will be called before toggling edit mode.
 * @returns cellModesModel, setCellModesModel, handleCellClick, handleCellModelsChange
 */
export const useSingleClickCellEditMode = (onCellClick?: (params: GridCellParams) => void) => {
  const [ cellModesModel, setCellModesModel ] = useState<GridCellModesModel>({});

  const handleCellModelsChange = (newModel: GridCellModesModel) => setCellModesModel(newModel);

  const handleCellClick = (params: GridCellParams) => {
    onCellClick?.(params);
    if (!params.isEditable) return;

    setCellModesModel((prevModel) => {
      return {
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {},
            ),
          }),
          {},
        ),
        [params.id]: {
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({
              // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
              ...acc,
              [field]: { mode: GridCellModes.View }
            }),
            {},
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      };
    });
  };

  return { cellModesModel, setCellModesModel, handleCellClick, handleCellModelsChange }
}