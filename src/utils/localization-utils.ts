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
    REST: t("vehicleList.truckDriveStateStatus.stopped"),
    DRIVER_AVAILABLE: t("vehicleList.truckDriveStateStatus.stopped"),
    WORK: t("vehicleList.truckDriveStateStatus.stopped"),
    DRIVE: t("vehicleList.truckDriveStateStatus.driving"),
    ERROR: t("vehicleList.truckDriveStateStatus.stopped"),
    NOT_AVAILABLE: t("vehicleList.truckDriveStateStatus.stopped"),
  })[status];

  export const getLocalizedTruckEvent = (taskType: TaskType, t: TFunction) => ({
    LOAD: t("vehicleList.truckEventType.load"),
    UNLOAD: t("vehicleList.truckEventType.unload"),
  })[taskType];
}

export default LocalizationUtils;