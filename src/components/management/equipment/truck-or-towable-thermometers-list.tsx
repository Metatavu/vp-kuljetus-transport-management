import { Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ToolbarRow from "components/generic/toolbar-row";
import { getListTruckOrTowableThermometersQueryOptions } from "hooks/use-queries";
import { forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ThermometersTable from "../thermometers-table";

type Props = {
  entityId: string;
  entityType: "truck" | "towable";
  setChangedTerminalThermometerNames: React.Dispatch<
    React.SetStateAction<{ newName: string; thermometerId: string }[]>
  >;
};

const TruckOrTowableThermometersList = forwardRef(
  ({ entityId, entityType, setChangedTerminalThermometerNames }: Props, ref) => {
    const { t } = useTranslation();

    const listThermometersQuery = useQuery(
      getListTruckOrTowableThermometersQueryOptions({ entityId, entityType, max: 100 }),
    );
    const thermometers = useMemo(() => listThermometersQuery.data ?? [], [listThermometersQuery.data]);

    return (
      <Paper>
        <ToolbarRow title={t("management.equipment.sensors")} />
        <ThermometersTable
          ref={ref}
          thermometers={thermometers}
          setChangedTerminalThermometerNames={setChangedTerminalThermometerNames}
        />
      </Paper>
    );
  },
);

export default TruckOrTowableThermometersList;
