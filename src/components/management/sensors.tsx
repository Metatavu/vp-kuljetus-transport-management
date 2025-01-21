import { Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { Temperature, Thermometer } from "generated/client";
import {
  getListThermometersQueryOptions,
  getListTowableTemperaturesQueryOptions,
  getListTruckTemperaturesQueryOptions,
} from "hooks/use-queries";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  entityId: string;
  entityType: "truck" | "towable";
};

const Sensors = ({ entityId, entityType }: Props) => {
  const { t } = useTranslation();

  const listThermometersQuery = useQuery(getListThermometersQueryOptions({ entityId, entityType }));
  const thermometers = useMemo(() => listThermometersQuery.data ?? [], [listThermometersQuery.data]);
  const temperatures =
    entityType === "truck"
      ? useQueries({
          queries: thermometers.map((thermometer) =>
            getListTruckTemperaturesQueryOptions({ truckId: thermometer.entityId, first: 0, max: 1 }),
          ),
          combine: (results) =>
            results.reduce((map, result) => {
              const temperature = result.data?.at(0);
              if (temperature) map.set(temperature.thermometerId, temperature);
              return map;
            }, new Map<string, Temperature>()),
        })
      : useQueries({
          queries: thermometers.map((thermometer) =>
            getListTowableTemperaturesQueryOptions({ towableId: thermometer.entityId, first: 0, max: 1 }),
          ),
          combine: (results) =>
            results.reduce((map, result) => {
              const temperature = result.data?.at(0);
              if (temperature) map.set(temperature.thermometerId, temperature);
              return map;
            }, new Map<string, Temperature>()),
        });

  const columns = useMemo<GridColDef<Thermometer>[]>(
    () => [
      {
        field: "name",
        headerName: t("management.sensors.name"),
        flex: 1,
      },
      {
        field: "temperature",
        headerName: t("management.sensors.temperature"),
        flex: 1,
        valueGetter: ({ row }) => (row.id ? temperatures.get(row.id)?.value : ""),
      },
      {
        field: "last-alarm-date",
        headerName: t("management.sensors.lastAlarm"),
        flex: 1,
      },
      {
        field: "alarm",
        headerName: t("management.sensors.alarmSetting"),
        flex: 1,
      },
    ],
    [t],
  );

  return (
    <Paper>
      <ToolbarRow title={t("management.equipment.sensors")} />
      <GenericDataGrid rows={thermometers} columns={columns} />
    </Paper>
  );
};

export default Sensors;
