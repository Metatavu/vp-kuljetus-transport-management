import { WorkShiftHours, WorkType } from "generated/client";

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
}

export default WorkShiftsUtils;
