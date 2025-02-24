import {
  AbsenceType,
  CompensationType,
  EmployeeType,
  Office,
  PerDiemAllowanceType,
  SalaryGroup,
  TaskType,
  TruckDriveStateEnum,
  WorkEventType,
} from "generated/client";
import { TFunction } from "i18next";

namespace LocalizationUtils {
  export const getLocalizedTaskType = (type: TaskType, t: TFunction) =>
    ({
      LOAD: t("drivePlanning.tasks.loadTaskType"),
      UNLOAD: t("drivePlanning.tasks.unloadTaskType"),
    })[type];

  export const getLocalizedEquipmentType = (type: string, t: TFunction) =>
    ({
      TRUCK: t("equipmentType.truck"),
      SEMI_TRUCK: t("equipmentType.semiTruck"),
      TRAILER: t("equipmentType.trailer"),
      SEMI_TRAILER: t("equipmentType.semiTrailer"),
      DOLLY: t("equipmentType.dolly"),
    })[type];

  export const getLocalizedTruckDriveState = (status: TruckDriveStateEnum, t: TFunction) =>
    ({
      REST: t("vehicles.truckDriveState.rest"),
      DRIVER_AVAILABLE: t("vehicles.truckDriveState.driverAvailable"),
      WORK: t("vehicles.truckDriveState.work"),
      DRIVE: t("vehicles.truckDriveState.drive"),
      ERROR: t("vehicles.truckDriveState.error"),
      NOT_AVAILABLE: t("vehicles.truckDriveState.notAvailable"),
    })[status];

  export const getLocalizedDriveStateStatus = (status: TruckDriveStateEnum, t: TFunction) =>
    ({
      REST: t("vehicles.truckDriveStateStatus.rest"),
      DRIVER_AVAILABLE: t("vehicles.truckDriveStateStatus.driverAvailable"),
      WORK: t("vehicles.truckDriveStateStatus.working"),
      DRIVE: t("vehicles.truckDriveStateStatus.driving"),
      ERROR: t("vehicles.truckDriveStateStatus.error"),
      NOT_AVAILABLE: t("vehicles.truckDriveStateStatus.notAvailable"),
    })[status];

  export const getLocalizedTruckEvent = (taskType: TaskType, t: TFunction) =>
    ({
      LOAD: t("vehicles.truckEventType.load"),
      UNLOAD: t("vehicles.truckEventType.unload"),
    })[taskType];

  export const getLocalizedOffice = (office: Office, t: TFunction) =>
    ({
      KOTKA: t("management.employees.offices.kotka"),
      KOUVOLA: t("management.employees.offices.kouvola"),
      RAUHA: t("management.employees.offices.rauha"),
    })[office];

  export const getLocalizedSalaryGroup = (salaryGroup: SalaryGroup, t: TFunction) =>
    ({
      DRIVER: t("management.employees.salaryGroups.driver"),
      VPLOGISTICS: t("management.employees.salaryGroups.vpLogistics"),
      OFFICE: t("management.employees.salaryGroups.office"),
      TERMINAL: t("management.employees.salaryGroups.terminal"),
    })[salaryGroup];

  export const getLocalizedEmployeeType = (type: EmployeeType, t: TFunction) =>
    ({
      PA: t("management.employees.types.pa"),
      KA: t("management.employees.types.ka"),
      AH: t("management.employees.types.ah"),
      VK: t("management.employees.types.vk"),
      TH: t("management.employees.types.th"),
      TP: t("management.employees.types.tp"),
      AJ: t("management.employees.types.aj"),
      JH: t("management.employees.types.jh"),
      AP: t("management.employees.types.ap"),
      KK: t("management.employees.types.kk"),
      POIS: t("management.employees.types.pois"),
      TPK: t("management.employees.types.tpk"),
    })[type];

  export const getLocalizedCompensationType = (compensationType: CompensationType, t: TFunction) =>
    ({
      PUBLIC_HOLIDAY_ALLOWANCE: t("management.holidays.compensationType.publicHolidayAllowance"),
      DAY_OFF_WORK_ALLOWANCE: t("management.holidays.compensationType.dayOffWorkAllowance"),
    })[compensationType];

  export const getLocalizedWorkEventType = (workEventType: WorkEventType, t: TFunction) =>
    ({
      SHIFT_START: t("workingHours.workingDays.workShiftDialog.eventTypes.shiftStart"),
      SHIFT_END: t("workingHours.workingDays.workShiftDialog.eventTypes.shiftEnd"),
      AVAILABILITY: t("workingHours.workingDays.workShiftDialog.eventTypes.availability"),
      BREAK: t("workingHours.workingDays.workShiftDialog.eventTypes.break"),
      BREWERY: t("workingHours.workingDays.workShiftDialog.eventTypes.brewery"),
      DRIVE: t("workingHours.workingDays.workShiftDialog.eventTypes.drive"),
      DRIVER_CARD_INSERTED: t("workingHours.workingDays.workShiftDialog.eventTypes.driverCardInserted"),
      DRIVER_CARD_REMOVED: t("workingHours.workingDays.workShiftDialog.eventTypes.driverCardRemoved"),
      DRY: t("workingHours.workingDays.workShiftDialog.eventTypes.dry"),
      FROZEN: t("workingHours.workingDays.workShiftDialog.eventTypes.frozen"),
      GREASE: t("workingHours.workingDays.workShiftDialog.eventTypes.grease"),
      LOADING: t("workingHours.workingDays.workShiftDialog.eventTypes.loading"),
      LOGIN: t("workingHours.workingDays.workShiftDialog.eventTypes.login"),
      LOGOUT: t("workingHours.workingDays.workShiftDialog.eventTypes.logout"),
      MEAT_CELLAR: t("workingHours.workingDays.workShiftDialog.eventTypes.meatCellar"),
      MEIRA: t("workingHours.workingDays.workShiftDialog.eventTypes.meira"),
      OTHER_WORK: t("workingHours.workingDays.workShiftDialog.eventTypes.otherWork"),
      PALTE: t("workingHours.workingDays.workShiftDialog.eventTypes.palte"),
      UNKNOWN: t("workingHours.workingDays.workShiftDialog.eventTypes.unknown"),
      UNLOADING: t("workingHours.workingDays.workShiftDialog.eventTypes.unloading"),
      VEGETABLE: t("workingHours.workingDays.workShiftDialog.eventTypes.vegetable"),
      OFFICE: t("workingHours.workingDays.workShiftDialog.eventTypes.office"),
    })[workEventType];

  export const getLocalizedAbsenceType = (absenceType: AbsenceType, t: TFunction) =>
    ({
      TRAINING: t("workingHours.workingDays.aggregationsTable.absenceTypes.training"),
      VACATION: t("workingHours.workingDays.aggregationsTable.absenceTypes.vacation"),
      OFFICIAL_DUTIES: t("workingHours.workingDays.aggregationsTable.absenceTypes.officialDuties"),
      COMPENSATORY_LEAVE: t("workingHours.workingDays.aggregationsTable.absenceTypes.compensatoryLeave"),
      SICK_LEAVE: t("workingHours.workingDays.aggregationsTable.absenceTypes.sickLeave"),
    })[absenceType];

  export const getLocalizedAbsenceAbbreviation = (absenceType: AbsenceType, t: TFunction) =>
    ({
      TRAINING: t("workingHours.workingDays.abbreviations.training"),
      VACATION: t("workingHours.workingDays.abbreviations.vacation"),
      OFFICIAL_DUTIES: t("workingHours.workingDays.abbreviations.officialDuties"),
      COMPENSATORY_LEAVE: t("workingHours.workingDays.abbreviations.compensatoryLeave"),
      SICK_LEAVE: t("workingHours.workingDays.abbreviations.sickLeave"),
    })[absenceType];

  export const getPerDiemAllowanceType = (perDiemAllowanceType: PerDiemAllowanceType, t: TFunction) =>
    ({
      PARTIAL: t("workingHours.workingDays.aggregationsTable.perDiemAllowanceTypes.partial"),
      FULL: t("workingHours.workingDays.aggregationsTable.perDiemAllowanceTypes.full"),
    })[perDiemAllowanceType];

  export const getPerDiemAllowanceAbbreviation = (perDiemAllowanceType: PerDiemAllowanceType, t: TFunction) =>
    ({
      PARTIAL: t("workingHours.workingDays.abbreviations.partial"),
      FULL: t("workingHours.workingDays.abbreviations.full"),
    })[perDiemAllowanceType];
}

export default LocalizationUtils;
