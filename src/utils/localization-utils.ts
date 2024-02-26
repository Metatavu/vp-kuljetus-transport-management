import { TaskType } from "generated/client";
import { TFunction } from "i18next";

namespace LocalizationUtils {
  export const getLocalizedTaskType = (type: TaskType, t: TFunction) => ({
    LOAD: t("drivePlanning.tasks.loadTaskType"),
    UNLOAD: t("drivePlanning.tasks.unloadTaskType"),
  })[type];
}

export default LocalizationUtils;