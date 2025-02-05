import { Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { TerminalTemperature, TerminalThermometer } from "generated/client";
import { getListTerminalTemperaturesQueryOptions, getListTerminalThermometersQueryOptions } from "hooks/use-queries";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  siteId: string | undefined;
};

const Thermometers = ({ siteId }: Props) => {
  const { t } = useTranslation();

  const listThermometersQuery = useQuery(getListTerminalThermometersQueryOptions({ siteId }));
  const thermometers = useMemo(() => listThermometersQuery.data ?? [], [listThermometersQuery.data]);
  const temperatures = useQueries({
    queries: thermometers.map((thermometer) =>
      getListTerminalTemperaturesQueryOptions({ siteId: thermometer.siteId, first: 0, max: 1 }),
    ),
    combine: (results) =>
      results.reduce((map, result) => {
        const temperature = result.data?.at(0);
        if (temperature) map.set(temperature.thermometerId, temperature);
        return map;
      }, new Map<string, TerminalTemperature>()),
  });

  const columns = useMemo<GridColDef<TerminalThermometer>[]>(
    () => [
      {
        field: "name",
        headerName: t("management.terminals.thermometers.name"),
        flex: 1,
      },
      {
        field: "hardwareSensorId",
        headerName: t("management.terminals.thermometers.hardwareSensorId"),
        flex: 1,
      },
      {
        field: "deviceIdentifier",
        headerName: t("management.terminals.thermometers.deviceIdentifier"),
        flex: 1,
      },
      {
        field: "temperature",
        headerName: t("management.terminals.thermometers.temperature"),
        flex: 1,
        valueGetter: ({ row }) => (row.id ? temperatures.get(row.id)?.value : ""),
      },
      {
        field: "last-alarm-date",
        headerName: t("management.terminals.thermometers.lastAlarm"),
        flex: 1,
      },
      {
        field: "alarm",
        headerName: t("management.terminals.thermometers.alarmSetting"),
        flex: 1,
      },
    ],
    [t, temperatures],
  );

  return (
    <Paper>
      <ToolbarRow title={t("management.terminals.thermometers.thermometers")} />
      <GenericDataGrid hideFooter rows={thermometers} columns={columns} />
    </Paper>
  );
};

export default Thermometers;
