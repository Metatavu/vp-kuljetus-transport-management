import { Towable, Truck } from "generated/client";

export const getEquipmentDisplayName = (equipment: Truck | Towable) =>
  equipment.name ? `${equipment.name} / ${equipment.plateNumber}` : equipment.plateNumber;
