import { AbsenceType, Employee, PerDiemAllowanceType, WorkShiftHours, WorkType } from "generated/client";
import { DateTime } from "luxon";
import { EmployeeWorkHoursFormRow } from "src/types";

namespace WorkShiftsUtils {
  export const getWorkShiftHoursWithWorkTypes = (workShiftHours: WorkShiftHours[]) => {
    return workShiftHours.reduce<Record<WorkType, WorkShiftHours>>(
      (workShiftHoursRecord, singleWorkShiftHours) => {
        workShiftHoursRecord[singleWorkShiftHours.workType] = singleWorkShiftHours;
        return workShiftHoursRecord;
      },
      {} as Record<WorkType, WorkShiftHours>,
    );
  };

  export const getTotalWorkHoursByType = (shiftsInWorkPeriod: EmployeeWorkHoursFormRow[], workType: WorkType) => {
    const aggregatedHours = shiftsInWorkPeriod
      .reduce((acc, row) => {
        const workShiftHours = row.workShiftHours[workType];
        return acc + (workShiftHours?.actualHours ?? workShiftHours?.calculatedHours ?? 0);
      }, 0)
      .toFixed(2);
    return aggregatedHours;
  };

  export const getPerDiemAllowanceCount = (
    shiftsInWorkPeriod: EmployeeWorkHoursFormRow[],
    perDiemAllowance: PerDiemAllowanceType,
  ) => {
    return shiftsInWorkPeriod.filter((row) => row.workShift?.perDiemAllowance === perDiemAllowance).length.toString();
  };

  export const getFillingHours = (shiftsInWorkPeriod: EmployeeWorkHoursFormRow[], employee: Employee) => {
    const regularWorkingHours = getRegularWorkingHoursOnWorkPeriod(employee, shiftsInWorkPeriod);
    if (!regularWorkingHours) return 0;

    const workTypes = [WorkType.PaidWork, WorkType.SickLeave];
    const totalPaidWorkHours = workTypes
      .map((type) => parseFloat(getTotalWorkHoursByType(shiftsInWorkPeriod, type)))
      .reduce((sum, hours) => sum + hours, 0);
    if (totalPaidWorkHours >= regularWorkingHours) return 0;

    // Absence types that are included in the calculation
    const absenceTypes: (keyof typeof AbsenceType)[] = ["Vacation", "CompensatoryLeave"];
    const totalAbsenceHours = absenceTypes
      .map((type) => parseFloat(getTotalHoursByAbsenseType(shiftsInWorkPeriod, AbsenceType[type])))
      .reduce((sum, hours) => sum + hours, 0);

    const fillingHours = regularWorkingHours - totalPaidWorkHours - totalAbsenceHours;
    return fillingHours > 0 ? fillingHours.toFixed(2) : 0;
  };

  export const getOverTimeHoursForDriver = (shiftsInWorkPeriod: EmployeeWorkHoursFormRow[], employee: Employee) => {
    if (!employee?.regularWorkingHours) return { overTimeHalf: 0, overTimeFull: 0 };
    const vacationHours = parseFloat(getTotalHoursByAbsenseType(shiftsInWorkPeriod, AbsenceType.Vacation));
    // Check if the employee has more than 40 hours of vacation in work period and adjust the limit for full overtime
    const overTimeFullLimit = vacationHours > 40 ? 10 : 12;
    const regularWorkingHours = getRegularWorkingHoursOnWorkPeriod(employee, shiftsInWorkPeriod);
    // Calculate paid work hours without training hours (training hours does not cumulate overtime)
    const paidWorkHoursFromWorkTypes =
      parseFloat(getTotalWorkHoursByType(shiftsInWorkPeriod, WorkType.PaidWork)) -
      parseFloat(getTotalWorkHoursByType(shiftsInWorkPeriod, WorkType.Training));
    const paidVacationAndCompensatoryLeaveHours =
      parseFloat(getTotalHoursByAbsenseType(shiftsInWorkPeriod, AbsenceType.Vacation)) +
      parseFloat(getTotalHoursByAbsenseType(shiftsInWorkPeriod, AbsenceType.CompensatoryLeave));
    const paidWorkHours = paidWorkHoursFromWorkTypes + paidVacationAndCompensatoryLeaveHours;

    if (paidWorkHours <= regularWorkingHours) {
      return { overTimeHalf: 0, overTimeFull: 0 };
    }
    //Check if paid work hours are between regular working hours and regular working hours + 12
    if (paidWorkHours > regularWorkingHours && paidWorkHours <= regularWorkingHours + overTimeFullLimit) {
      return { overTimeHalf: (paidWorkHours - regularWorkingHours).toFixed(2), overTimeFull: 0 };
    }
    //Check if paid work hours are over regular working hours + 12
    if (paidWorkHours > regularWorkingHours + overTimeFullLimit) {
      return {
        overTimeHalf: overTimeFullLimit,
        overTimeFull: (paidWorkHours - overTimeFullLimit - regularWorkingHours).toFixed(2),
      };
    }

    return { overTimeHalf: 0, overTimeFull: 0 };
  };

  export const getOverTimeHoursForOfficeAndTerminalWorkers = (shiftsInWorkPeriod: EmployeeWorkHoursFormRow[]) => {
    const overTimeResult = { overTimeHalf: 0, overTimeFull: 0 };

    // Iterate over each work shift to calculate overtime on a daily basis
    for (const shift of shiftsInWorkPeriod) {
      const dailyWorkHours =
        shift.workShiftHours[WorkType.PaidWork]?.actualHours ??
        shift.workShiftHours[WorkType.PaidWork]?.calculatedHours ??
        0;
      const regularWorkLimit = 8; // Regular worktime per shift
      const halfOverTimeLimit = 2; // First 2 hours after regular time are half overtime

      if (dailyWorkHours > regularWorkLimit) {
        const overTimeHours = dailyWorkHours - regularWorkLimit;

        if (overTimeHours <= halfOverTimeLimit) {
          overTimeResult.overTimeHalf += overTimeHours;
        } else {
          overTimeResult.overTimeHalf += halfOverTimeLimit;
          overTimeResult.overTimeFull += overTimeHours - halfOverTimeLimit;
        }
      }
    }

    return {
      overTimeHalf: overTimeResult.overTimeHalf.toFixed(2),
      overTimeFull: overTimeResult.overTimeFull.toFixed(2),
    };
  };

  export const getTotalHoursByAbsenseType = (shiftsInWorkPeriod: EmployeeWorkHoursFormRow[], absence: AbsenceType) => {
    return shiftsInWorkPeriod
      .filter((row) => row.workShift?.absence === absence)
      .reduce((acc, row) => {
        // Compensatory leave is 8 hours per day
        if (absence === AbsenceType.CompensatoryLeave) {
          return acc + 8;
        }
        // Vacation is 6.67 hours per day
        if (absence === AbsenceType.Vacation) {
          return acc + 6.67;
        }
        const workShiftHours = row.workShiftHours[WorkType.PaidWork];
        return acc + (workShiftHours?.actualHours ?? workShiftHours?.calculatedHours ?? 0);
      }, 0)
      .toFixed(2);
  };

  // Get day off work allowance hours are calculated for the shift start date, not the whole shift.
  export const getDayOffWorkAllowanceHours = (shiftsInWorkPeriod: EmployeeWorkHoursFormRow[]) => {
    return shiftsInWorkPeriod
      .filter((row) => {
        return row.workShift?.dayOffWorkAllowance;
      })
      .reduce((acc, row) => {
        const startedAt = row.workShift.startedAt
          ? DateTime.fromJSDate(row.workShift.startedAt)
          : DateTime.fromJSDate(row.workShift.date).startOf("day");
        const endedAt = row.workShift?.endedAt ? DateTime.fromJSDate(row.workShift.endedAt) : DateTime.now();

        // Check if the shift is on the same day or if the shift was added manually (no start time)
        if (startedAt.hasSame(endedAt, "day") || !row.workShift.startedAt) {
          const workShiftHours = row.workShiftHours[WorkType.PaidWork];
          return acc + (workShiftHours?.actualHours ?? workShiftHours?.calculatedHours ?? 0);
        }

        // Calculate hours for the first day of the shift
        const hoursOnFirstDay = startedAt.endOf("day").diff(startedAt, "hours").hours;

        return acc + hoursOnFirstDay;
      }, 0)
      .toFixed(2);
  };

  export const getRegularWorkingHoursOnWorkPeriod = (
    employee: Employee,
    shiftsInWorkPeriod: EmployeeWorkHoursFormRow[],
  ) => {
    if (!employee.regularWorkingHours) return 0;
    const unpaidHours = Number(WorkShiftsUtils.getTotalWorkHoursByType(shiftsInWorkPeriod, WorkType.Unpaid));

    return unpaidHours ? employee.regularWorkingHours - unpaidHours : employee.regularWorkingHours;
  };
}

export default WorkShiftsUtils;
