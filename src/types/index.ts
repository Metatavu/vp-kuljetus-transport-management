import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { SvgIcon } from "@mui/material";
import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";
import { EmployeeWorkShift, Site, Task, TaskType, Truck, WorkEvent, WorkShiftHours, WorkType } from "generated/client";
import { DefaultNamespace, ParseKeys } from "i18next";
import { DateTime } from "luxon";

export type LocalizedLabelKey = ParseKeys<DefaultNamespace> | TemplateStringsArray;

export type Breadcrumb = {
  label: string;
  route?: RoutePaths<RegisteredRouter["routeTree"]>;
};

export type NavigationItem = {
  route?: RoutePaths<RegisteredRouter["routeTree"]>;
  label: LocalizedLabelKey;
  Icon?: typeof SvgIcon;
  date?: DateTime<true>;
};

type UnallocatedTasksRowDragHandle = {
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
};

export type UnallocatedTasksRowDragHandles = Record<string, UnallocatedTasksRowDragHandle | undefined>;

/**
 * Enum for vehicle list columns
 */
export enum VehicleListColumns {
  Name = "name",
  Number = "number",
  Address = "address",
  Location = "location",
  Status = "status",
  Trailer = "trailer",
  Driver = "driver",
}

export type GroupedTask = {
  tasks: Task[];
  groupNumber: number;
  taskType: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
  routeId: string;
};

export const DraggableType = {
  GROUPED_TASK: "grouped-task",
  UNALLOCATED_TASK: "unallocated-task",
} as const;
export type DraggableType = (typeof DraggableType)[keyof typeof DraggableType];

export const DroppableType = {
  ROUTES_TASKS_DROPPABLE: "routes-tasks-droppable",
  UNALLOCATED_TASKS_DROPPABLE: "unallocated-tasks-droppable",
} as const;
export type DroppableType = (typeof DroppableType)[keyof typeof DroppableType];

export type DraggedTaskData = {
  draggableType: "grouped-task";
  tasks: Task[];
  routeId: string;
  key: string;
};

export type EmployeeWorkHoursForm = EmployeeWorkHoursFormRow[];

export type EmployeeWorkHoursFormRow = {
  workShift: EmployeeWorkShift;
  workShiftHours: Record<WorkType, WorkShiftHours>;
};

export type WorkShiftDialogWorkEventRow = {
  workEvent: WorkEvent;
  truck?: Truck;
  duration: number;
  distance: number;
};
