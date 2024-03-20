import { SvgIcon } from "@mui/material";
import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";
import { Site, Task, TaskType } from "generated/client";
import { DefaultNamespace, ParseKeys } from "i18next";

export type LocalizedLabelKey = ParseKeys<DefaultNamespace> | TemplateStringsArray;

export type NavigationItem = readonly [RoutePaths<RegisteredRouter["routeTree"]>, LocalizedLabelKey, typeof SvgIcon | undefined];

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
  Driver = "driver"
}

export type GroupedTask = {
  tasks: Task[];
  groupNumber: number;
  type: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
  routeId: string;
};

export const DraggableType =  {
  GROUPED_TASK: "grouped-task",
  UNALLOCATED_TASK: "unallocated-task",
} as const;
export type DraggableType = typeof DraggableType[keyof typeof DraggableType];

export const DroppableType =  {
  ROUTES_TASKS_DROPPABLE: "routes-tasks-droppable",
  UNALLOCATED_TASKS_DROPPABLE: "unallocated-tasks-droppable",
 } as const;
export type DroppableType = typeof DroppableType[keyof typeof DroppableType];

export type GroupedTaskSortableData = {
  draggableType: "grouped-task";
  draggedTasks: Task[];
  allTasks: Task[];
  routeId: string;
};

export type DroppableData = {
  routeId: string;
  allTasks: Task[];
};

export type UnallocatedTaskDraggableData = {
  draggableType: "unallocated-task";
  task: Task;
};

// TODO: Use this type for both grouped and unallocated tasks
export type DraggedTaskData = {
  draggableType : DraggableType;
  draggedTasks: Task[];
  routesTasks: Task[];
}