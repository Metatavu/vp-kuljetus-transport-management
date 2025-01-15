import { Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const Sensors = () => {
  const { t } = useTranslation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nimi",
        flex: 1,
      },
      {
        field: "temperature",
        headerName: "Lämpötila",
        flex: 1,
      },
      {
        field: "alarm",
        headerName: "Hälytysasetus",
        flex: 1,
      },
      {
        field: "last-alarm-date",
        headerName: "Viimeisin hälytys",
        flex: 1,
      },
      {
        field: "mac-address",
        headerName: "MAC-osoite",
        flex: 1,
      },
    ],
    [],
  );

  return (
    <Paper>
      <ToolbarRow title={t("management.equipment.sensors")} />
      <GenericDataGrid rows={[]} columns={columns} />
    </Paper>
  );
};

export default Sensors;
