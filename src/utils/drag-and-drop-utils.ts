import type { Task } from "generated/client";

export type TRouteTasks = Record<string, Task[]>;

namespace DragAndDropUtils {
  /**
   * Moves dragged tasks (that are currently assigned to a route) to another route.
   *
   * @param activeRouteId current route id of the dragged tasks
   * @param overRouteId route id of the route where the tasks are moved to
   * @param newIndex index within the route where the tasks are moved to
   * @param routeTasks map of route id to tasks
   * @param draggedTasks tasks that are dragged
   * @returns updated route tasks
   */
  export const moveTaskFromRouteToRoute = (
    activeRouteId: string,
    overRouteId: string,
    newIndex: number,
    routeTasks: TRouteTasks,
    draggedTasks: Task[],
  ): TRouteTasks => {
    const newTargetRouteTasks = [
      ...routeTasks[overRouteId].slice(0, newIndex),
      ...draggedTasks,
      ...routeTasks[overRouteId].slice(newIndex, routeTasks[overRouteId].length),
    ];
    const originRouteTasks = routeTasks[activeRouteId] ?? [];
    const activeDraggedTaskIds = draggedTasks.map((task: Task) => task.id);
    const newTasks = originRouteTasks.filter((task) => !activeDraggedTaskIds.includes(task.id));

    return {
      ...routeTasks,
      [activeRouteId]: newTasks.filter((task, index, self) => index === self.findIndex((t) => t.id === task.id)),
      [overRouteId]: newTargetRouteTasks.filter(
        (task, index, array) => index === array.findIndex((t) => t.id === task.id),
      ),
    };
  };

  /**
   * Moves dragged tasks (that are currently assigned to a route) to the bottom of the route.
   *
   * @param activeRouteId current route id of the dragged tasks
   * @param overRouteId route id of the route where the tasks are moved to
   * @param routeTasks map of route id to tasks
   * @param draggedTasks tasks that are dragged
   * @returns updated route tasks
   */
  export const moveTaskFromRouteToBottomOfRoute = (
    activeRouteId: string,
    overRouteId: string,
    routeTasks: TRouteTasks,
    draggedTasks: Task[],
  ): TRouteTasks => {
    const originRouteTasks = routeTasks[activeRouteId] ?? [];
    const targetRouteTasks = routeTasks[overRouteId] ?? [];
    const activeDraggedTaskIds = draggedTasks.map((task: Task) => task.id);
    const newTasks = originRouteTasks.filter((task) => !activeDraggedTaskIds.includes(task.id));

    return {
      ...routeTasks,
      [activeRouteId]: newTasks,
      [overRouteId]: [...targetRouteTasks, ...draggedTasks],
    };
  };

  /**
   * Moves unallocated task to a route
   *
   *  @param overRouteId route id of the route where the tasks are moved to
   * @param newIndex index within the route where the tasks are moved to
   * @param routeTasks map of route id to tasks
   * @param draggedTasks tasks that are dragged
   * @returns updated route tasks
   */
  export const moveUnallocatedTasksToRoute = (
    overRouteId: string,
    newIndex: number,
    routeTasks: TRouteTasks,
    draggedTasks: Task[],
  ): TRouteTasks => {
    const targetRouteTasks = routeTasks[overRouteId] ?? [];
    const activeDraggedTaskIds = draggedTasks.map((task: Task) => task.id);
    const newTasks = targetRouteTasks.filter((task) => !activeDraggedTaskIds.includes(task.id));

    return {
      ...routeTasks,
      [overRouteId]: [
        ...newTasks.slice(0, newIndex),
        ...draggedTasks,
        ...newTasks.slice(newIndex, newTasks.length),
      ].filter((task, index, self) => index === self.findIndex((t) => t.id === task.id)),
    };
  };

  /**
   * Removes tasks from route
   *
   * @param routeTasks map of route id to tasks
   * @param draggedTasks tasks that are dragged
   * @returns updated route tasks
   */
  export const removeTasksFromRoute = (routeTasks: TRouteTasks, draggedTasks: Task[]): TRouteTasks => {
    const newRouteTasks: TRouteTasks = {};
    for (const key of Object.keys(routeTasks)) {
      const routesTasks = routeTasks[key];
      const draggedTaskIds = draggedTasks.map((task) => task.id);
      newRouteTasks[key] = routesTasks.filter((task) => !draggedTaskIds.includes(task.id));
    }

    return newRouteTasks;
  };
}

export default DragAndDropUtils;
