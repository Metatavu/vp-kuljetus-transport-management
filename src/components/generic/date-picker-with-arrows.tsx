import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  date: DateTime | null;
  labelVisible?: boolean;
  setDate: Dispatch<SetStateAction<DateTime | null>>;
};

const DatePickerWithArrows = ({ date, labelVisible, setDate }: Props) => {
  const { t } = useTranslation();

  const minusOneDay = (currentDate: DateTime | null) => {
    if (currentDate === null) return DateTime.now().minus({ day: 1 });
    return currentDate?.minus({ day: 1 });
  };

  const plusOneDay = (currentDate: DateTime | null) => {
    if (currentDate === null) return DateTime.now().plus({ day: 1 });
    return currentDate?.plus({ day: 1 });
  };

  const onChangeDate = (newDate: DateTime | null) => {
    setDate(newDate ?? DateTime.now());
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
      <Button variant="text" startIcon={<ArrowBack />} size="small" onClick={() => setDate(minusOneDay)}>
        {t("previousDay")}
      </Button>
      <DatePicker
        label={labelVisible && t("drivePlanning.routes.date")}
        value={date}
        slotProps={{ openPickerButton: { size: "small", title: t("openCalendar") }, textField: { size: "small" } }}
        onChange={onChangeDate}
      />
      <Button variant="text" endIcon={<ArrowForward />} size="small" onClick={() => setDate(plusOneDay)}>
        {t("nextDay")}
      </Button>
    </Stack>
  );
};

export default DatePickerWithArrows;
