import { styled } from "@mui/material";
import { DataGrid, DataGridProps, fiFI } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid, {
  label: "styled-data-grid",
})(() => ({
  minHeight: "calc(100% - 48px)",
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
}));

const GenericDataGrid = ({ columns, rows }: DataGridProps) => {
  return (
    <StyledDataGrid
      columns={columns}
      rows={rows}
      columnHeaderHeight={30}
      rowHeight={38}
      disableColumnMenu
      autoHeight
      localeText={fiFI.components.MuiDataGrid.defaultProps.localeText}
    />
  );
};

export default GenericDataGrid;
