import { TaskType } from "generated/client";
import { LocalizedLabelKey } from "src/types";

namespace LocalizationUtils {
  export const getLocalizedTaskType = (type: TaskType): LocalizedLabelKey<"drivePlanning.tasks"> => ({
    LOAD: "loadTaskType",
    UNLOAD: "unloadTaskType",
  } as Record<TaskType, LocalizedLabelKey<"drivePlanning.tasks">>)[type];
}

export default LocalizationUtils;