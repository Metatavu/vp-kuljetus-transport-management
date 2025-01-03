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

  export const getSumOfWorkHoursFromWorkPeriod = (workShiftsData: EmployeeWorkHoursFormRow[], workType: WorkType) => {
    const aggregatedHours = workShiftsData
      .reduce((acc, row) => {
        const workShiftHours = row.workShiftHours[workType];
        return acc + (workShiftHours?.actualHours ?? workShiftHours?.calculatedHours ?? 0);
      }, 0)
      .toFixed(2);
    return aggregatedHours;
  };

  export const getPerDiemAllowanceCount = (
    workShiftsData: EmployeeWorkHoursFormRow[],
    perDiemAllowance: PerDiemAllowanceType,
  ) => {
    return workShiftsData.filter((row) => row.workShift?.perDiemAllowance === perDiemAllowance).length.toString();
  };

  export const getFillingHours = (workShiftsData: EmployeeWorkHoursFormRow[], employee: Employee) => {
    if (!employee?.regularWorkingHours) return 0;
    const regularWorkingHours = employee?.regularWorkingHours;
    const paidWorkHours = parseFloat(getSumOfWorkHoursFromWorkPeriod(workShiftsData, WorkType.PaidWork));
    if (paidWorkHours < regularWorkingHours) {
      const fillingHours = regularWorkingHours - paidWorkHours;
      return fillingHours > 0 ? fillingHours.toFixed(2) : 0;
    }
    return 0;
  };

  export const getOverTimeHoursForDriver = (workShiftsData: EmployeeWorkHoursFormRow[], employee: Employee) => {
    if (!employee?.regularWorkingHours) return { overTimeHalf: 0, overTimeFull: 0 };
    const vacationHours = parseFloat(getAbsenceHours(workShiftsData, AbsenceType.Vacation));
    // Check if the employee has more than 40 hours of vacation in work period and adjust the limit for full overtime
    const overTimeFullLimit = vacationHours > 40 ? 10 : 12;
    const regularWorkingHours = employee?.regularWorkingHours;
    const paidWorkHours = parseFloat(getSumOfWorkHoursFromWorkPeriod(workShiftsData, WorkType.PaidWork));
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

  // TODO: Needs better description before implementing
  // export const getOverTimeHoursForOfficeAndTerminal = (workShiftsData: EmployeeWorkHoursFormRow[], employee: Employee) => {
  //   if (!employee?.regularWorkingHours) return { overTimeHalf: 0, overTimeFull: 0 };

  //   return { overTimeHalf: 0, overTimeFull: 0 };
  // };

  export const getAbsenceHours = (workShiftsData: EmployeeWorkHoursFormRow[], absence: AbsenceType) => {
    return workShiftsData
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
  export const getDayOffWorkAllowanceHours = (workShiftsData: EmployeeWorkHoursFormRow[]) => {
    return workShiftsData
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
}

export default WorkShiftsUtils;
