import { TaskType } from "generated/client";
import { LocalizedLabelKey } from "src/types";

namespace LocalizationUtils {
  export const getLocalizedTaskType = (type: TaskType): LocalizedLabelKey => ({
    LOAD: "drivePlanning.tasks.loadTaskType",
    UNLOAD: "drivePlanning.tasks.unloadTaskType",
  } as Record<TaskType, LocalizedLabelKey>)[type];
}

export default LocalizationUtils;