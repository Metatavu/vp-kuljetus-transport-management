import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";

type Props = {
  date: DateTime<true>;
  labelVisible?: boolean;
  buttonsWithText?: boolean;
  setDate: (date: DateTime<true>) => void;
};

const DatePickerWithArrows = ({ date, labelVisible, buttonsWithText, setDate }: Props) => {
  const { t } = useTranslation();

  const minusOneDay = (currentDate: DateTime) => {
    if (currentDate === null) return DateTime.now().minus({ day: 1 });
    return currentDate?.minus({ day: 1 });
  };

  const plusOneDay = (currentDate: DateTime) => {
    if (currentDate === null) return DateTime.now().plus({ day: 1 });
    return currentDate?.plus({ day: 1 });
  };

  const onChangeDate = (newDate: DateTime | null) => setDate(newDate ?? DateTime.now());

  const renderPreviousDayButton = () => {
    if (!buttonsWithText)
      return (
        <IconButton size="small" onClick={() => setDate(minusOneDay(date))}>
          <ArrowBack />
        </IconButton>
      );

    return (
      <Button
        variant="text"
        color="primary"
        startIcon={<ArrowBack />}
        size="small"
        onClick={() => setDate(minusOneDay(date))}
      >
        {t("previousDay")}
      </Button>
    );
  };

  const renderNextDayButton = () => {
    if (!buttonsWithText)
      return (
        <IconButton size="small" onClick={() => setDate(plusOneDay(date))}>
          <ArrowForward />
        </IconButton>
      );

    return (
      <Button
        variant="text"
        color="primary"
        endIcon={<ArrowForward />}
        size="small"
        onClick={() => setDate(plusOneDay(date))}
      >
        {t("nextDay")}
      </Button>
    );
  };

  return (
    <Stack display="inline-flex" direction="row" justifyContent="center" alignItems="center" gap={1}>
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
