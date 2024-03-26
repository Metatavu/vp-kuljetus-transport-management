import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  date: DateTime | null;
  labelVisible?: boolean;
  buttonsWithText?: boolean;
  setDate: Dispatch<SetStateAction<DateTime | null>>;
};

const DatePickerWithArrows = ({ date, labelVisible, buttonsWithText, setDate }: Props) => {
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

  const renderPreviousDayButton = () => {
    if (!buttonsWithText) return (
      <IconButton size="small" onClick={() => setDate(minusOneDay)}>
        <ArrowBack />
      </IconButton>
    )

    return (
      <Button variant="text" startIcon={<ArrowBack />} size="small" onClick={() => setDate(minusOneDay)}>
        {t("previousDay")}
      </Button>
    );
  }

  const renderNextDayButton = () => {
    if (!buttonsWithText) return (
      <IconButton size="small" onClick={() => setDate(plusOneDay)}>
        <ArrowForward />
      </IconButton>
    )

    return (
      <Button variant="text" endIcon={<ArrowForward />} size="small" onClick={() => setDate(plusOneDay)}>
        {t("nextDay")}
      </Button>
    );
  }

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
      {renderPreviousDayButton()}
      <DatePicker
        label={labelVisible && t("drivePlanning.routes.date")}
        value={date}
        slotProps={{ openPickerButton: { size: "small", title: t("openCalendar") }, textField: { size: "small" } }}
        onChange={onChangeDate}
      />
      {renderNextDayButton()}
    </Stack>
  );
};

export default DatePickerWithArrows;
