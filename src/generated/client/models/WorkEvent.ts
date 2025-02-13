/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/**
 * Vehicle Management Services (management)
 * Vehicle Management Services (management)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { WorkEventType } from './WorkEventType';
import {
    WorkEventTypeFromJSON,
    WorkEventTypeFromJSONTyped,
    WorkEventTypeToJSON,
} from './WorkEventType';

/**
 * Represents single work event.
 * 
 * Whenever employee tracks a new work event, it is determined, whether a new work shift should be created for
 * the event, or if the event should be added to the shift of the last work event recorded.
 * 
 * A new work shift should be created, if either
 * - There are no previous work events for the employee, or
 * - The last work event is of type SHIFT_END, or
 * - The last work event is of type BREAK or UNKNOWN and has been going on longer than 3 hours
 * 
 * A work shift might already exist for the current day with _no_ events. This can happen, if a shift has been
 * created manually by the manager in advance. In this case, whenever a new shift would be created, the event
 * should be added to this existing work shift instead.
 * 
 * @export
 * @interface WorkEvent
 */
export interface WorkEvent {
    /**
     * 
     * @type {string}
     * @memberof WorkEvent
     */
    readonly id?: string;
    /**
     * Employee's ID
     * @type {string}
     * @memberof WorkEvent
     */
    employeeId: string;
    /**
     * employee work shift ID
     * @type {string}
     * @memberof WorkEvent
     */
    readonly employeeWorkShiftId?: string;
    /**
     * Work event time
     * @type {Date}
     * @memberof WorkEvent
     */
    time: Date;
    /**
     * 
     * @type {string}
     * @memberof WorkEvent
     */
    costCenter?: string;
    /**
     * The ID of truck used during the work event
     * @type {string}
     * @memberof WorkEvent
     */
    truckId?: string;
    /**
     * 
     * @type {WorkEventType}
     * @memberof WorkEvent
     */
    workEventType: WorkEventType;
}

/**
 * Check if a given object implements the WorkEvent interface.
 */
export function instanceOfWorkEvent(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "employeeId" in value;
    isInstance = isInstance && "time" in value;
    isInstance = isInstance && "workEventType" in value;

    return isInstance;
}

export function WorkEventFromJSON(json: any): WorkEvent {
    return WorkEventFromJSONTyped(json, false);
}

export function WorkEventFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkEvent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'employeeId': json['employeeId'],
        'employeeWorkShiftId': !exists(json, 'employeeWorkShiftId') ? undefined : json['employeeWorkShiftId'],
        'time': (new Date(json['time'])),
        'costCenter': !exists(json, 'costCenter') ? undefined : json['costCenter'],
        'truckId': !exists(json, 'truckId') ? undefined : json['truckId'],
        'workEventType': WorkEventTypeFromJSON(json['workEventType']),
    };
}

export function WorkEventToJSON(value?: WorkEvent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'employeeId': value.employeeId,
        'time': (value.time.toISOString()),
        'costCenter': value.costCenter,
        'truckId': value.truckId,
        'workEventType': WorkEventTypeToJSON(value.workEventType),
    };
}

