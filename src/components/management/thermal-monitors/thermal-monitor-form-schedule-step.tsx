import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-form";
import { RadioOption } from "components/form/radio-group";
import { ThermalMonitorSchedulePeriod, ThermalMonitorScheduleWeekDay, ThermalMonitorType } from "generated/client";
import { withForm } from "hooks/form";
import { DateTime, HourNumbers, Interval, MinuteNumbers, WeekdayNumbers } from "luxon";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import TimeUtils from "src/utils/time-utils";
import { ThermalMonitorFormValues } from "./thermal-monitor-form-dialog";

type WeekdaySchedule = {
  weekday: ThermalMonitorScheduleWeekDay;
  startHour?: HourNumbers;
  startMinute?: MinuteNumbers;
  endHour?: HourNumbers;
  endMinute?: MinuteNumbers;
};

const WEEKDAYS = [
  ThermalMonitorScheduleWeekDay.Monday,
  ThermalMonitorScheduleWeekDay.Tuesday,
  ThermalMonitorScheduleWeekDay.Wednesday,
  ThermalMonitorScheduleWeekDay.Thursday,
  ThermalMonitorScheduleWeekDay.Friday,
  ThermalMonitorScheduleWeekDay.Saturday,
  ThermalMonitorScheduleWeekDay.Sunday,
] as const;

const scheduleWeekdayToNumber = (weekday: ThermalMonitorScheduleWeekDay): WeekdayNumbers => {
  return (WEEKDAYS.indexOf(weekday) + 1) as WeekdayNumbers;
};

const ThermalMonitorFormScheduleStep = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  render: function Render({ form }) {
    const { t } = useTranslation();

    const schedule = useStore(form.store, (state) => state.values.schedule);

    const weekdaySchedules = useMemo(() => {
      const schedulesToIntervals = (schedule ?? []).map((schedule) => {
        const startDate = DateTime.fromObject({
          weekday: scheduleWeekdayToNumber(schedule.start.weekday),
          hour: schedule.start.hour,
          minute: schedule.start.minute,
        });
        const endDate = DateTime.fromObject({
          weekday: scheduleWeekdayToNumber(schedule.end.weekday),
          hour: schedule.end.hour,
          minute: schedule.end.minute,
        });
        return Interval.fromDateTimes(startDate, endDate);
      });

      const mergedIntervals = Interval.merge(schedulesToIntervals).filter(TimeUtils.isValidInterval);

      return WEEKDAYS.map<WeekdaySchedule>((weekday) => {
        const intervalsContainingWeekday = mergedIntervals.filter((interval) =>
          interval.overlaps(
            Interval.fromDateTimes(
              DateTime.fromObject({ weekday: scheduleWeekdayToNumber(weekday) }).startOf("day"),
              DateTime.fromObject({ weekday: scheduleWeekdayToNumber(weekday) }).endOf("day"),
            ),
          ),
        );

        if (intervalsContainingWeekday.length === 0) return { weekday };

        const weekdayStart = DateTime.fromObject({
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
        const weekdaysWithSchedule = weekdaySchedules.filter(
          (weekdaySchedule) =>
            weekdaySchedule.startHour !== undefined &&
            weekdaySchedule.startMinute !== undefined &&
            weekdaySchedule.endHour !== undefined &&
            weekdaySchedule.endMinute !== undefined,
        );

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

    const onUpdateWeekdayHours = useCallback(
      (
        weekdaySchedules: WeekdaySchedule[],
        weekday: ThermalMonitorScheduleWeekDay,
        values: Partial<Omit<WeekdaySchedule, "weekday">>,
      ) => {
        form.setFieldValue("schedule", () =>
          timesForWeekdaysToSchedulePeriods(
            weekdaySchedules.map((weekdaySchedule) =>
              weekdaySchedule.weekday === weekday ? { ...weekdaySchedule, ...values } : weekdaySchedule,
            ),
          ),
        );
      },
      [form, timesForWeekdaysToSchedulePeriods],
    );

    const getWeekdayTimePropertiesByType = (type: "start" | "end") =>
      ({
        start: ["startHour", "startMinute"] as const,
        end: ["endHour", "endMinute"] as const,
      })[type];

    const onTimePickerValueChange =
      (weekdaySchedule: WeekdaySchedule, type: "start" | "end") => (value: DateTime | null) => {
        const [hourProperty, minuteProperty] = getWeekdayTimePropertiesByType(type);

        if (!value?.isValid) return;

        if (
          type === "start" &&
          !Interval.fromDateTimes(
            DateTime.fromObject({ hour: value.hour, minute: value.minute }),
            DateTime.fromObject({
              hour: weekdaySchedule.endHour,
              minute: weekdaySchedule.endMinute,
            }),
          ).isValid
        ) {
          return;
        }

        if (
          type === "end" &&
          !Interval.fromDateTimes(
            DateTime.fromObject({
              hour: weekdaySchedule.startHour,
              minute: weekdaySchedule.startMinute,
            }),
            DateTime.fromObject({ hour: value.hour, minute: value.minute }),
          ).isValid
        ) {
          return;
        }

        onUpdateWeekdayHours(weekdaySchedules, weekdaySchedule.weekday, {
          [hourProperty]: value.hour,
          [minuteProperty]: value.minute,
        });
      };

    const renderTimePickerField = (weekdaySchedule: WeekdaySchedule, type: "start" | "end") => {
      const [hourProperty, minuteProperty] = getWeekdayTimePropertiesByType(type);
      const hours = weekdaySchedule[hourProperty];
      const minutes = weekdaySchedule[minuteProperty];

      const pickerValue =
        hours !== undefined && minutes !== undefined
          ? (DateTime.fromObject({ hour: hours, minute: minutes }) as DateTime<true>)
          : null;

      const disabled = hours === undefined || minutes === undefined;

      const maxTime =
        type === "start"
          ? DateTime.fromObject({ hour: weekdaySchedule.endHour, minute: weekdaySchedule.endMinute })
          : undefined;

      const minTime =
        type === "end"
          ? DateTime.fromObject({ hour: weekdaySchedule.startHour, minute: weekdaySchedule.startMinute })
          : undefined;

      return (
        <TimePicker
          value={pickerValue}
          disabled={disabled}
          minTime={minTime}
          maxTime={maxTime}
          onChange={onTimePickerValueChange(weekdaySchedule, type)}
          slotProps={{ openPickerButton: { sx: { p: 0.25, mr: 0.25 } } }}
        />
      );
    };

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
        <form.Subscribe
          selector={(state) => state.values.type === ThermalMonitorType.Scheduled}
          children={(isScheduled) =>
            isScheduled ? (
              <>
                <Stack width={300}>
                  <Typography variant="h6">{t("management.thermalMonitors.weekdays.title")}</Typography>
                  {weekdaySchedules.map((weekdaySchedule) => (
                    <FormControlLabel
                      key={weekdaySchedule.weekday}
                      label={t(`management.thermalMonitors.weekdays.${weekdaySchedule.weekday}`)}
                      style={{ height: 48 }}
                      control={
                        <Checkbox
                          checked={weekdaySchedule.startHour !== undefined}
                          onChange={(event) =>
                            onToggleWeekday(weekdaySchedules, weekdaySchedule.weekday, event.target.checked)
                          }
                        />
                      }
                    />
                  ))}
                </Stack>
                <Stack width={300}>
                  <Typography variant="h6">{t("management.thermalMonitors.times")}</Typography>
                  {weekdaySchedules.map((weekdaySchedule) => (
                    <Stack key={weekdaySchedule.weekday} direction="row" alignItems="center" gap={2} height={48}>
                      {renderTimePickerField(weekdaySchedule, "start")}
                      {"—"}
                      {renderTimePickerField(weekdaySchedule, "end")}
                    </Stack>
                  ))}
                </Stack>
              </>
            ) : null
          }
        />
      </Stack>
    );
  },
});

export default ThermalMonitorFormScheduleStep;
