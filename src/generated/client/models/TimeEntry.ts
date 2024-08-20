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
/**
 * Represents single time entry
 * @export
 * @interface TimeEntry
 */
export interface TimeEntry {
    /**
     * 
     * @type {string}
     * @memberof TimeEntry
     */
    readonly id?: string;
    /**
     * Employee's id
     * @type {string}
     * @memberof TimeEntry
     */
    employeeId: string;
    /**
     * Time entry start time
     * @type {Date}
     * @memberof TimeEntry
     */
    startTime: Date;
    /**
     * Time entry end time. End time is not required for time entries that are still running.
     * If an employee has an existing time entry without an end time and the new entry is missing end time,
     * the new time entry should not be created and instead a bad request is to be returned.
     * When a new entry is created with both start and end times, the existing entry is ignored.
     * 
     * @type {Date}
     * @memberof TimeEntry
     */
    endTime?: Date;
    /**
     * Work type id
     * @type {string}
     * @memberof TimeEntry
     */
    workTypeId: string;
}

/**
 * Check if a given object implements the TimeEntry interface.
 */
export function instanceOfTimeEntry(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "employeeId" in value;
    isInstance = isInstance && "startTime" in value;
    isInstance = isInstance && "workTypeId" in value;

    return isInstance;
}

export function TimeEntryFromJSON(json: any): TimeEntry {
    return TimeEntryFromJSONTyped(json, false);
}

export function TimeEntryFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimeEntry {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'employeeId': json['employeeId'],
        'startTime': (new Date(json['startTime'])),
        'endTime': !exists(json, 'endTime') ? undefined : (new Date(json['endTime'])),
        'workTypeId': json['workTypeId'],
    };
}

export function TimeEntryToJSON(value?: TimeEntry | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'employeeId': value.employeeId,
        'startTime': (value.startTime.toISOString()),
        'endTime': value.endTime === undefined ? undefined : (value.endTime.toISOString()),
        'workTypeId': value.workTypeId,
    };
}

