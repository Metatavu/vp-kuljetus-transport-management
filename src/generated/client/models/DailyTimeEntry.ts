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
 * Represents a single daily time entry. Daily time entries are created when total working hours
 * of an employee for some work type needs to be manually changed for a specific day. Only a single
 * daily time entry per work type per day is allowed. If one already exists, it should be updated.
 * Daily time entry is always prioritized over calculating the total from the actual time entries
 * when displaying the aggregated hours and sending the data to payroll.
 * 
 * @export
 * @interface DailyTimeEntry
 */
export interface DailyTimeEntry {
    /**
     * 
     * @type {string}
     * @memberof DailyTimeEntry
     */
    readonly id?: string;
    /**
     * Employee's id
     * @type {string}
     * @memberof DailyTimeEntry
     */
    employeeId: string;
    /**
     * Daily time entry date
     * @type {Date}
     * @memberof DailyTimeEntry
     */
    date: Date;
    /**
     * 
     * @type {WorkEventType}
     * @memberof DailyTimeEntry
     */
    workEventType: WorkEventType;
    /**
     * Corrected hours for the day for corresponding work type.
     * @type {number}
     * @memberof DailyTimeEntry
     */
    hours: number;
    /**
     * Whether the daily time entry has been approved by a supervisor.
     * Hours cannot be updated unless approved is set to false.
     * 
     * @type {boolean}
     * @memberof DailyTimeEntry
     */
    approved: boolean;
}

/**
 * Check if a given object implements the DailyTimeEntry interface.
 */
export function instanceOfDailyTimeEntry(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "employeeId" in value;
    isInstance = isInstance && "date" in value;
    isInstance = isInstance && "workEventType" in value;
    isInstance = isInstance && "hours" in value;
    isInstance = isInstance && "approved" in value;

    return isInstance;
}

export function DailyTimeEntryFromJSON(json: any): DailyTimeEntry {
    return DailyTimeEntryFromJSONTyped(json, false);
}

export function DailyTimeEntryFromJSONTyped(json: any, ignoreDiscriminator: boolean): DailyTimeEntry {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'employeeId': json['employeeId'],
        'date': (new Date(json['date'])),
        'workEventType': WorkEventTypeFromJSON(json['workEventType']),
        'hours': json['hours'],
        'approved': json['approved'],
    };
}

export function DailyTimeEntryToJSON(value?: DailyTimeEntry | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'employeeId': value.employeeId,
        'date': (value.date.toISOString().substring(0,10)),
        'workEventType': WorkEventTypeToJSON(value.workEventType),
        'hours': value.hours,
        'approved': value.approved,
    };
}

