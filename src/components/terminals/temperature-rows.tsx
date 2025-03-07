import { Box, Divider, Stack, Typography } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { TerminalTemperature, TerminalThermometer } from "generated/client";
import { getListTerminalTemperaturesQueryOptions } from "hooks/use-queries";

type Props = {
  thermometers: TerminalThermometer[];
};

const TemperatureRows = ({ thermometers }: Props) => {
  const temperatures = useQueries({
    queries: thermometers.map((thermometer) => ({
      ...getListTerminalTemperaturesQueryOptions({ siteId: thermometer.siteId, first: 0, max: thermometers.length }),
      refetchInterval: 10_000,
    })),
    combine: (results) =>
      results.reduce((map, result, currentIndex) => {
        const temperature = result.data?.at(currentIndex);
        if (temperature) map.set(temperature.thermometerId, temperature);
        return map;
      }, new Map<string, TerminalTemperature>()),
  });

  return (
    <>
      {thermometers.map((thermometer) => {
        return (
          <>
            <Stack direction="row" key={thermometer.id}>
              <Box flex={1} p={2}>
                <Typography variant="h5">{thermometer.name}</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box width={100} p={2}>
                <Typography variant="h5" align="right">
                  {thermometer.id && temperatures.get(thermometer.id)?.value !== undefined
                    ? `${temperatures.get(thermometer.id)?.value.toFixed(1)} °C`
                    : "--.-"}
                </Typography>
              </Box>
            </Stack>
            <Divider />
          </>
        );
      })}
    </>
  );
};

export default TemperatureRows;
