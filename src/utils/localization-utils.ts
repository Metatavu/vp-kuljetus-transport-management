import { TaskType, TruckDriveStateEnum } from "generated/client";
import { TFunction } from "i18next";

namespace LocalizationUtils {
  export const getLocalizedTaskType = (type: TaskType, t: TFunction) => ({
    LOAD: t("drivePlanning.tasks.loadTaskType"),
    UNLOAD: t("drivePlanning.tasks.unloadTaskType"),
  })[type];

  export const getLocalizedEquipmentType = (type: string, t: TFunction) => ({
    TRUCK: t("equipmentType.truck"),
    SEMI_TRUCK: t("equipmentType.semiTruck"),
    TRAILER: t("equipmentType.trailer"),
    SEMI_TRAILER: t("equipmentType.semiTrailer"),
    DOLLY: t("equipmentType.dolly")
  })[type];

  export const getLocalizedTruckDriveState = (status: TruckDriveStateEnum, t: TFunction) => ({
    REST: t("vehicleList.truckDriveState.rest"),
    DRIVER_AVAILABLE: t("vehicleList.truckDriveState.driverAvailable"),
    WORK: t("vehicleList.truckDriveState.work"),
    DRIVE: t("vehicleList.truckDriveState.drive"),
    ERROR: t("vehicleList.truckDriveState.error"),
    NOT_AVAILABLE: t("vehicleList.truckDriveState.notAvailable"),
  })[status];

  export const getLocalizedDriveStateStatus = (status: TruckDriveStateEnum, t: TFunction) => ({
    REST: t("vehicleList.truckDriveStateStatus.working"),
    DRIVER_AVAILABLE: t("vehicleList.truckDriveStateStatus.working"),
    WORK: t("vehicleList.truckDriveStateStatus.working"),
    DRIVE: t("vehicleList.truckDriveStateStatus.driving"),
    ERROR: t("vehicleList.truckDriveStateStatus.stopped"),
    NOT_AVAILABLE: t("vehicleList.truckDriveStateStatus.stopped"),
  })[status];

  export const getLocalizedTruckEvent = (taskType: TaskType, t: TFunction) => ({
    LOAD: t("vehicleList.truckEventType.load"),
    UNLOAD: t("vehicleList.truckEventType.unload"),
  })[taskType];

  export const getLocalizedOffice = (office: Office, t: TFunction) => ({
    KOTKA: t("management.employees.offices.kotka"),
    KOUVOLA: t("management.employees.offices.kouvola"),
    RAUHA: t("management.employees.offices.rauha"),
  })[office];

  export const getLocalizedSalaryGroup = (salaryGroup: SalaryGroup, t: TFunction) => ({
    DRIVER: t("management.employees.salaryGroups.driver"),
    VPLOGISTICS: t("management.employees.salaryGroups.vpLogistics"),
    OFFICE: t("management.employees.salaryGroups.office"),
    TERMINAL: t("management.employees.salaryGroups.terminal")
  })[salaryGroup];

  export const getLocalizedEmployeeType = (type: EmployeeType, t: TFunction) => ({
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
    TPK: t("management.employees.types.tpk")
  })[type];
}

export default LocalizationUtils;