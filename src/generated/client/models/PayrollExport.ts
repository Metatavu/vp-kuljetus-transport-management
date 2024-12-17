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
 * Represents a single payroll export.
 * 
 * A payroll export is created when a list of work shifts of a single employee is sent to payroll management.
 * The export is created by a manager and contains a list of work shift IDs that are sent to payroll. All of
 * the included work shifts must be approved before the export can be created. The total work hours are then
 * calculated from the work shifts and sent to payroll management in a CSV file.
 * 
 * @export
 * @interface PayrollExport
 */
export interface PayrollExport {
    /**
     * 
     * @type {string}
     * @memberof PayrollExport
     */
    readonly id?: string;
    /**
     * Employee's ID
     * @type {string}
     * @memberof PayrollExport
     */
    employeeId: string;
    /**
     * List of work shift IDs included in the payroll export
     * @type {Array<string>}
     * @memberof PayrollExport
     */
    workShiftIds: Array<string>;
    /**
     * Name of CSV file sent to payroll management.
     * @type {string}
     * @memberof PayrollExport
     */
    readonly csvFileName?: string;
    /**
     * Creator's ID
     * @type {string}
     * @memberof PayrollExport
     */
    creatorId?: string;
    /**
     * Export time
     * @type {Date}
     * @memberof PayrollExport
     */
    exportedAt?: Date;
}

/**
 * Check if a given object implements the PayrollExport interface.
 */
export function instanceOfPayrollExport(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "employeeId" in value;
    isInstance = isInstance && "workShiftIds" in value;

    return isInstance;
}

export function PayrollExportFromJSON(json: any): PayrollExport {
    return PayrollExportFromJSONTyped(json, false);
}

export function PayrollExportFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayrollExport {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'employeeId': json['employeeId'],
        'workShiftIds': json['workShiftIds'],
        'csvFileName': !exists(json, 'csvFileName') ? undefined : json['csvFileName'],
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'exportedAt': !exists(json, 'exportedAt') ? undefined : (new Date(json['exportedAt'])),
    };
}

export function PayrollExportToJSON(value?: PayrollExport | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'employeeId': value.employeeId,
        'workShiftIds': value.workShiftIds,
        'creatorId': value.creatorId,
        'exportedAt': value.exportedAt === undefined ? undefined : (value.exportedAt.toISOString()),
    };
}
