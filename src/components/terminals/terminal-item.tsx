import { Box, Card, CardHeader, Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { TerminalThermometer } from "generated/client";
import { getListTerminalThermometersQueryOptions } from "hooks/use-queries";
import { useMemo } from "react";
import TemperatureRows from "./temperature-rows";

type Props = {
  title: string;
  siteId: string | undefined;
};

const TerminalItem = ({ title, siteId }: Props) => {
  const listThermometersQuery = useQuery(getListTerminalThermometersQueryOptions({ siteId, max: 100 }));
  const thermometersByDeviceIdentifier = useMemo(() => {
    return (listThermometersQuery.data ?? []).reduce(
      (list, thermometer) => {
        const indexOfMatchingIdentifier = list.findIndex(
          (item) => item.deviceIdentifier === thermometer.deviceIdentifier,
        );

        if (indexOfMatchingIdentifier > -1) {
          list[indexOfMatchingIdentifier].thermometers.push(thermometer);
        } else {
          list.push({ deviceIdentifier: thermometer.deviceIdentifier, thermometers: [thermometer] });
        }

        return list;
      },
      [] as { deviceIdentifier: string; thermometers: TerminalThermometer[] }[],
    );
  }, [listThermometersQuery.data]);

  const renderThermometerRow = (deviceIdentifier: string, thermometers: TerminalThermometer[]) => {
    return (
      <Box flex={1} key={deviceIdentifier}>
        <TemperatureRows thermometers={thermometers} />
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader sx={{ bgcolor: "#EDF3F5" }} disableTypography title={<Typography variant="h4">{title}</Typography>} />
      <Divider />
      {thermometersByDeviceIdentifier.map(({ deviceIdentifier, thermometers }) =>
        renderThermometerRow(deviceIdentifier, thermometers),
      )}
    </Card>
  );
};

export default TerminalItem;
