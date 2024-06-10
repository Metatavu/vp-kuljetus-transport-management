import { GridCellParams, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { useState } from "react";

/**
 * A hook to toggle DataGrid row edit mode on single click.
 * 
 * Overrides default behaviour of DataGrid to enter edit mode on double click.
 * 
 * @returns rowModesModel, setRowModesModel, handleCellClick, handleRowModelsChange
 */
export const useSingleClickRowEditMode = () => {
  const [ rowModesModel, setRowModesModel ] = useState<GridRowModesModel>({});
  
  const handleRowModelsChange = (newModel: GridRowModesModel) => setRowModesModel(newModel);
  
  const handleCellClick = (params: GridCellParams) => {
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
  };
  
  return { rowModesModel, setRowModesModel, handleCellClick, handleRowModelsChange }
}