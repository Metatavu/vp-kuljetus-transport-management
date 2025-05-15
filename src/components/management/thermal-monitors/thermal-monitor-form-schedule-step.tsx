import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-form";
import { RadioOption } from "components/form/radio-group";
import { ThermalMonitorSchedulePeriod, ThermalMonitorScheduleWeekDay, ThermalMonitorType } from "generated/client";
import { withForm } from "hooks/form";
import { DateTime, HourNumbers, Interval, MinuteNumbers, WeekdayNumbers } from "luxon";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ThermalMonitorFormValues } from "routes/management.thermal-monitors.add";
import TimeUtils from "src/utils/time-utils";

type WeekdaySchedule = {
  weekday: ThermalMonitorScheduleWeekDay;
  startHour?: HourNumbers;
  startMinute?: MinuteNumbers;
  endHour?: HourNumbers;
  endMinute?: MinuteNumbers;
};

const scheduleWeekdayToNumber = (weekday: ThermalMonitorScheduleWeekDay): WeekdayNumbers =>
  (
    ({
      [ThermalMonitorScheduleWeekDay.Monday]: 1,
      [ThermalMonitorScheduleWeekDay.Tuesday]: 2,
      [ThermalMonitorScheduleWeekDay.Wednesday]: 3,
      [ThermalMonitorScheduleWeekDay.Thursday]: 4,
      [ThermalMonitorScheduleWeekDay.Friday]: 5,
      [ThermalMonitorScheduleWeekDay.Saturday]: 6,
      [ThermalMonitorScheduleWeekDay.Sunday]: 7,
    }) as const
  )[weekday];

const ThermalMonitorFormScheduleStep = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  render: function Render({ form }) {
    const { t } = useTranslation();

    const schedule = useStore(form.store, (state) => state.values.schedule);

    console.log(JSON.stringify(schedule));

    const weekdaySchedules = useMemo(() => {
      const schedulesToIntervals = (schedule ?? []).map((schedule) =>
        Interval.fromDateTimes(
          DateTime.fromObject({
            year: 2000,
            weekday: scheduleWeekdayToNumber(schedule.start.weekday),
            hour: schedule.start.hour,
            minute: schedule.start.minute,
          }),
          DateTime.fromObject({
            year: 2000,
            weekday: scheduleWeekdayToNumber(schedule.end.weekday),
            hour: schedule.end.hour,
            minute: schedule.end.minute,
          }),
        ),
      );

      const mergedIntervals = Interval.merge(schedulesToIntervals).filter(TimeUtils.isValidInterval);

      return [
        ThermalMonitorScheduleWeekDay.Monday,
        ThermalMonitorScheduleWeekDay.Tuesday,
        ThermalMonitorScheduleWeekDay.Wednesday,
        ThermalMonitorScheduleWeekDay.Thursday,
        ThermalMonitorScheduleWeekDay.Friday,
        ThermalMonitorScheduleWeekDay.Saturday,
        ThermalMonitorScheduleWeekDay.Sunday,
      ].map<WeekdaySchedule>((weekday) => {
        const intervalsContainingWeekday = mergedIntervals.filter((interval) =>
          interval.contains(DateTime.fromObject({ year: 2000, weekday: scheduleWeekdayToNumber(weekday) })),
        );

        if (intervalsContainingWeekday.length === 0) return { weekday };

        const weekdayStart = DateTime.fromObject({
          year: 2000,
          weekday: scheduleWeekdayToNumber(weekday),
          hour: 0,
          minute: 0,
        }) as DateTime<true>;
        const weekdayEnd = weekdayStart.plus({ days: 1 });

        const startInterval = intervalsContainingWeekday.reduce((prev, curr) => {
          if (prev.start < curr.start) return prev;
          return curr;
        });

        const endInterval = intervalsContainingWeekday.reduce((prev, curr) => {
          if (prev.end > curr.end) return prev;
          return curr;
        });

        const unifiedIntervalForWeekday = startInterval.union(endInterval) as Interval<true>;

        const startHour = unifiedIntervalForWeekday.isBefore(weekdayStart)
          ? weekdayStart.hour
          : unifiedIntervalForWeekday.start.hour;
        const startMinute = unifiedIntervalForWeekday.isBefore(weekdayStart)
          ? weekdayStart.minute
          : unifiedIntervalForWeekday.start.minute;

        const endHour = unifiedIntervalForWeekday.isAfter(weekdayEnd)
          ? weekdayEnd.hour
          : unifiedIntervalForWeekday.end.hour;
        const endMinute = unifiedIntervalForWeekday.isAfter(weekdayEnd)
          ? weekdayEnd.minute
          : unifiedIntervalForWeekday.end.minute;

        return {
          weekday,
          startHour,
          startMinute,
          endHour,
          endMinute,
        };
      });
    }, [schedule]);

    const timesForWeekdaysToSchedulePeriods = useCallback(
      (weekdaySchedules: WeekdaySchedule[]): ThermalMonitorSchedulePeriod[] => {
        console.log("weekdaySchedules", weekdaySchedules);
        const weekdaysWithSchedule = weekdaySchedules.filter(
          (weekdaySchedule) =>
            weekdaySchedule.startHour !== undefined &&
            weekdaySchedule.startMinute !== undefined &&
            weekdaySchedule.endHour !== undefined &&
            weekdaySchedule.endMinute !== undefined,
        );

        console.log("weekdaySchedules", weekdaysWithSchedule);

        return weekdaysWithSchedule.reduce<ThermalMonitorSchedulePeriod[]>((schedulePeriods, weekdaySchedule) => {
          if (
            weekdaySchedule.startHour !== undefined &&
            weekdaySchedule.startMinute !== undefined &&
            weekdaySchedule.endHour !== undefined &&
            weekdaySchedule.endMinute !== undefined
          ) {
            schedulePeriods.push({
              start: {
                weekday: weekdaySchedule.weekday,
                hour: weekdaySchedule.startHour,
                minute: weekdaySchedule.startMinute,
              },
              end: {
                weekday: weekdaySchedule.weekday,
                hour: weekdaySchedule.endHour,
                minute: weekdaySchedule.endMinute,
              },
            });
          }

          return schedulePeriods;
        }, [] as ThermalMonitorSchedulePeriod[]);
      },
      [],
    );

    const onToggleWeekday = useCallback(
      (weekdaySchedules: WeekdaySchedule[], weekday: ThermalMonitorScheduleWeekDay, checked: boolean) =>
        form.setFieldValue("schedule", () =>
          timesForWeekdaysToSchedulePeriods(
            weekdaySchedules.map((weekdaySchedule) => {
              if (weekdaySchedule.weekday !== weekday) return weekdaySchedule;
              return checked ? { weekday, startHour: 0, startMinute: 0, endHour: 23, endMinute: 59 } : { weekday };
            }),
          ),
        ),
      [form, timesForWeekdaysToSchedulePeriods],
    );

    return (
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Stack spacing={2} sx={{ width: 300 }}>
          <Typography variant="h6">{t("management.thermalMonitors.defineMonitorActiveTimes")}</Typography>
          <form.AppField
            name="type"
            children={(field) => (
              <field.FormRadioGroup
                options={Object.values(ThermalMonitorType).map<RadioOption>((value) => ({
                  label: t(`management.thermalMonitors.type.${value}`),
                  value: value,
                }))}
              />
            )}
          />
        </Stack>
        <Stack spacing={2} sx={{ width: 300 }}>
          <Typography variant="h6">{t("management.thermalMonitors.weekdays.title")}</Typography>
          {weekdaySchedules.map((weekdaySchedule) => (
            <FormControlLabel
              key={weekdaySchedule.weekday}
              label={t(`management.thermalMonitors.weekdays.${weekdaySchedule.weekday}`)}
              control={
                <Checkbox
                  checked={weekdaySchedule.startHour !== undefined}
                  onChange={(event) => onToggleWeekday(weekdaySchedules, weekdaySchedule.weekday, event.target.checked)}
                />
              }
            />
          ))}
        </Stack>
        <Stack spacing={2} sx={{ width: 300 }}>
          <Typography variant="h6">{t("management.thermalMonitors.times")}</Typography>
        </Stack>
      </Stack>
    );
  },
});

export default ThermalMonitorFormScheduleStep;
