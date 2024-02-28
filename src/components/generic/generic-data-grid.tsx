import { styled } from "@mui/material";
import { DataGrid, DataGridProps, fiFI } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid, {
  label: "styled-data-grid",
})(() => ({
  "& .MuiDataGrid-cell, .MuiDataGrid-row": {
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#EDF3F5",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
  },
  "& .MuiDataGrid-footerContainer": {
    border: "none",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflow: "hidden",
  },
}));

const GenericDataGrid = ({
  columns,
  rows,
  paginationMode,
  paginationModel,
  rowCount,
  hideFooter,
  disableRowSelectionOnClick,
  slots,
  autoHeight = true,
  cellModesModel,
  rowModesModel,
  editMode,
  apiRef,
  sx,
  onPaginationModelChange,
  getRowId,
  processRowUpdate,
  onCellClick,
  onCellEditStop,
  onCellModesModelChange,
  onRowModesModelChange,
}: DataGridProps) => {
  return (
    <StyledDataGrid
      sx={sx}
      apiRef={apiRef}
      columns={columns}
      rows={rows}
      columnHeaderHeight={30}
      rowHeight={38}
      disableColumnMenu
      hideFooter={hideFooter}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      rowCount={rowCount}
      paginationMode={paginationMode}
      paginationModel={paginationModel}
      editMode={editMode}
      cellModesModel={cellModesModel}
      rowModesModel={rowModesModel}
      autoHeight={autoHeight}
      slots={slots}
      localeText={fiFI.components.MuiDataGrid.defaultProps.localeText}
      processRowUpdate={processRowUpdate}
      onCellModesModelChange={onCellModesModelChange}
      onRowModesModelChange={onRowModesModelChange}
      onCellEditStop={onCellEditStop}
      onCellClick={onCellClick}
      onPaginationModelChange={onPaginationModelChange}
      getRowId={getRowId}
    />
  );
};

export default GenericDataGrid;
