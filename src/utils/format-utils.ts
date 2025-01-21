import { ClientApp, Towable, Truck } from "generated/client";

export const getEquipmentDisplayName = (equipment: Truck | Towable) =>
  equipment.name ? `${equipment.name} (${equipment.plateNumber})` : equipment.plateNumber;

export const getClientAppTag = (clientApp?: ClientApp) => clientApp?.deviceId.slice(-4).toUpperCase();
