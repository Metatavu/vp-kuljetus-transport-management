import { ListItem, ListItemText } from "@mui/material";
import type { Site, Task, TaskType } from "generated/client";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";

type Props = {
  tasks: Task[];
  taskType: TaskType;
  groupNumber: number;
  site: Site;
};

const DraggedTaskOverlay = ({ tasks, taskType, groupNumber, site }: Props) => {
  const { t } = useTranslation();

  const { name, address, postalCode, locality } = site;

  return (
    <ListItem sx={{ display: "flex", flexDirection: "row", backgroundColor: "rgba(255,255,255,0.5)" }}>
      <ListItemText primary={LocalizationUtils.getLocalizedTaskType(taskType, t)} />
      <ListItemText primary={groupNumber} />
      <ListItemText primary={name} />
      <ListItemText primary={`${address}, ${postalCode} ${locality}`} />
      <ListItemText primary={tasks.length} />
    </ListItem>
  );
};

export default DraggedTaskOverlay;
