import { styled } from "@mui/material";
import { DataGrid, DataGridProps, fiFI } from "@mui/x-data-grid";

type StyledDataGridProps = {
  fullScreen?: boolean;
};

const StyledDataGrid = styled(DataGrid, {
  label: "styled-data-grid",
  shouldForwardProp: (prop) => prop !== "fullScreen",
})(({ fullScreen }: StyledDataGridProps) => ({
  minHeight: fullScreen ? "calc(100% - 42px)" : undefined,
  "& .MuiDataGrid-cell, .MuiDataGrid-row": {
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#EDF3F5",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto",
    overflowX: "hidden",
  },
}));

const GenericDataGrid = ({
  columns,
  rows,
  loading,
  paginationMode,
  paginationModel,
  rowCount,
  hideFooter,
  disableRowSelectionOnClick,
  slots,
  autoHeight = true,
  fullScreen = true,
  cellModesModel,
  rowModesModel,
  editMode,
  apiRef,
  sx,
  columnHeaderHeight = 30,
  onPaginationModelChange,
  getRowId,
  processRowUpdate,
  onCellClick,
  onCellEditStop,
  onCellModesModelChange,
  onRowModesModelChange,
}: DataGridProps & StyledDataGridProps) => {
  return (
    <StyledDataGrid
      fullScreen={fullScreen}
      sx={sx}
      apiRef={apiRef}
      columns={columns}
      rows={rows}
      loading={loading}
      columnHeaderHeight={columnHeaderHeight}
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
