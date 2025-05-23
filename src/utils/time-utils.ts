import { SalaryGroup } from "generated/client";
import { DateTime, Interval } from "luxon";

const WORKING_TIME_PERIOD_START_DATE = DateTime.now().set({ day: 7, month: 1, year: 2024 });

namespace TimeUtils {
  export const isValidInterval = (interval: Interval): interval is Interval<true> => interval.isValid;

  export const displayAsDateTime = (timestampInSeconds?: number, fallback?: string) => {
    if (timestampInSeconds === undefined) return fallback ?? "";
    return DateTime.fromSeconds(timestampInSeconds).toFormat("dd.MM.yyyy HH:mm:ss");
  };
  export const displayAsDate = (date?: Date) => {
    if (!date) return;

    return DateTime.fromJSDate(date).toFormat("dd.MM.yyyy");
  };

  export const eachDayOfWorkingPeriod = (start: Date, end: Date): DateTime[] => {
    const interval = Interval.fromDateTimes(
      DateTime.fromJSDate(start).startOf("day"),
      DateTime.fromJSDate(end).endOf("day"),
    );

    // Divide the interval into days and map them
    return interval
      .splitBy({ days: 1 })
      .map((i) => i.start)
      .filter((date): date is DateTime => date !== undefined);
  };

  /**
   * Gets working period start and end datetime according to salary group and selected date
   *
   * @param salaryGroup Salary group of the employee
   * @param selectedDate Selected date
   * @returns Start and end date of the working period
   */
  export const getWorkingPeriodDates = (salaryGroup: SalaryGroup, selectedDate: Date) => {
    const selectedDateTime = DateTime.fromJSDate(selectedDate);
    const isOfficeOrTerminalGroup = salaryGroup === SalaryGroup.Office || salaryGroup === SalaryGroup.Terminal;

    return isOfficeOrTerminalGroup ? getOfficeOrTerminalPeriod(selectedDateTime) : getDriverPeriod(selectedDateTime);
  };

  const getOfficeOrTerminalPeriod = (selectedDateTime: DateTime) => {
    const midMonth = 16;

    if (selectedDateTime.day < midMonth) {
      const start = selectedDateTime.startOf("month").toJSDate();
      const end = selectedDateTime.set({ day: 15 }).endOf("day").toJSDate();
      return { start, end };
    }

    const start = selectedDateTime.set({ day: 16 }).startOf("day").toJSDate();
    const end = selectedDateTime.endOf("month").endOf("day").toJSDate();
    return { start, end };
  };

  const getDriverPeriod = (selectedDateTime: DateTime) => {
    const fullWeeksFromStartDate = calculateFullWeeksFromStartDate(selectedDateTime);
    const remainderRoundedUp = Math.ceil(fullWeeksFromStartDate % 2);
    return calculatePeriod(fullWeeksFromStartDate - remainderRoundedUp);
  };

  const calculateFullWeeksFromStartDate = (selectedDateTime: DateTime) => {
    return Math.floor(selectedDateTime.diff(WORKING_TIME_PERIOD_START_DATE, "weeks").weeks);
  };

  const calculatePeriod = (startWeekOffset: number) => {
    const start = WORKING_TIME_PERIOD_START_DATE.plus({ weeks: startWeekOffset })
      .set({ weekday: 7 })
      .startOf("day")
      .toJSDate();
    const end = WORKING_TIME_PERIOD_START_DATE.plus({ weeks: startWeekOffset + 2 })
      .set({ weekday: 6 })
      .endOf("day")
      .toJSDate();
    return { start, end };
  };
}

export default TimeUtils;
