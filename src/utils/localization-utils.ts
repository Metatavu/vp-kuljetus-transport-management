import { TaskType } from "generated/client";
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
}

export default LocalizationUtils;