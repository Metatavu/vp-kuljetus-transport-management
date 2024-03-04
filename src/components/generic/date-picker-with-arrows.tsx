import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
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
    <Stack direction="row" justifyContent="center" justifyItems="center">
      <IconButton onClick={() => setDate(minusOneDay)}>
        <ArrowBack />
      </IconButton>
      <DatePicker
        label={labelVisible && t("drivePlanning.routes.date")}
        value={date}
        slotProps={{ textField: { fullWidth: true } }}
        onChange={onChangeDate}
        sx={{ padding: "4px 8px" }}
      />
      <IconButton onClick={() => setDate(plusOneDay)}>
        <ArrowForward />
      </IconButton>
    </Stack>
  );
};

export default DatePickerWithArrows;
