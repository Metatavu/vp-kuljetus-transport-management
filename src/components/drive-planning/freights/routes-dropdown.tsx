import { Popper, Paper, Stack, List, ListItemButton, ListItemText, styled } from "@mui/material";
import { GridCellModes, GridEditInputCell, GridRenderEditCellParams } from "@mui/x-data-grid";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";
import { Route, Task } from "generated/client";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useCallback } from "react";
import { theme } from "../../../theme";
import { useTranslation } from "react-i18next";

// Styled components
const DropDownPaper = styled(Paper, {
  label: "styled-dropdown--dropdown-paper",
})(() => ({
  borderRadius: 0,
  maxHeight: 250,
  overflow: "hidden",
  display: "flex",
}));

type Props = GridRenderEditCellParams<Task> & {
  routes: Route[];
  selectedDepartureDate: DateTime | null;
  setSelectedDepartureDate: Dispatch<SetStateAction<DateTime | null>>;
};

const RoutesDropdown = (props: Props) => {
  const { t } = useTranslation();

  const { selectedDepartureDate, setSelectedDepartureDate, ...rest } = props;
  const { api, colDef, id, field, routes, cellMode } = rest;
  const { getCellElement, setEditCellValue, stopRowEditMode } = api;

  if (!colDef) return null;

  const domElement = getCellElement(id, field);

  const getSelectedValue = useCallback(
    () => routes.find((route) => route.id === props.value)?.name ?? t("noSelection"),
    [routes, t, props],
  );

  return (
    <>
      <GridEditInputCell {...rest} disabled={true} value={getSelectedValue} />
      <Popper anchorEl={domElement} open={cellMode === GridCellModes.Edit} sx={{ zIndex: theme.zIndex.modal + 1 }}>
        <DropDownPaper elevation={1} sx={{ width: colDef.computedWidth }}>
          <Stack flex={1}>
            <DatePickerWithArrows
              date={selectedDepartureDate || DateTime.now().startOf("day")}
              setDate={setSelectedDepartureDate}
            />
            <List sx={{ flex: 1, overflowY: "auto" }}>
              {routes.map((route) => (
                <ListItemButton
                  key={route.id}
                  sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
                  onClick={async () => {
                    await setEditCellValue({
                      id: id,
                      field: field,
                      value: route.id,
                    });
                    stopRowEditMode({ id: id });
                  }}
                >
                  <ListItemText primary={route.name} />
                </ListItemButton>
              ))}
            </List>
          </Stack>
        </DropDownPaper>
      </Popper>
    </>
  );
};

export default RoutesDropdown;
