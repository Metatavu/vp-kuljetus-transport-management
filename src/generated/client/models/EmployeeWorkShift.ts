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
import type { AbsenceType } from './AbsenceType';
import {
    AbsenceTypeFromJSON,
    AbsenceTypeFromJSONTyped,
    AbsenceTypeToJSON,
} from './AbsenceType';
import type { PerDiemAllowanceType } from './PerDiemAllowanceType';
import {
    PerDiemAllowanceTypeFromJSON,
    PerDiemAllowanceTypeFromJSONTyped,
    PerDiemAllowanceTypeToJSON,
} from './PerDiemAllowanceType';

/**
 * Represents single employee work shift. A work event must always relate to an employee work shift.
 * 
 * When created, the work shift is not approved. It needs to be approved by a supervisor before the
 * work shift hours can be sent to payroll.
 * 
 * Employee work shift always relates to a single date. When work shift is created during the creation of
 * a work event, the date is derived from the work event. When created manually, the date should also be
 * set manually.
 * 
 * EndedAt and startedAt are derived from the work events in the shift. StartedAt is based on SHIFT_START event
 * and endedAt is based on SHIFT_END event. When the corresponding event is not found, the time is null.
 * 
 * When calculating salaries for a work period, all work shifts started within the period will be included
 * in their entirety, even if the events of the shifts would time-wise be outside the period.
 * 
 * @export
 * @interface EmployeeWorkShift
 */
export interface EmployeeWorkShift {
    /**
     * 
     * @type {string}
     * @memberof EmployeeWorkShift
     */
    readonly id?: string;
    /**
     * Work shift date.
     * @type {Date}
     * @memberof EmployeeWorkShift
     */
    date: Date;
    /**
     * Work shift start time
     * @type {Date}
     * @memberof EmployeeWorkShift
     */
    readonly startedAt?: Date;
    /**
     * Work shift end time
     * @type {Date}
     * @memberof EmployeeWorkShift
     */
    readonly endedAt?: Date;
    /**
     * Employee's ID
     * @type {string}
     * @memberof EmployeeWorkShift
     */
    employeeId: string;
    /**
     * List of truck IDs used during the work shift. Derived from work events in the shift.
     * @type {Array<string>}
     * @memberof EmployeeWorkShift
     */
    readonly truckIdsFromEvents?: Array<string>;
    /**
     * Day off work allowance is used to mark the day when the work shift started as a day off for the employee.
     * This means that all the work hours done during that day will be also added to the HOLIDAY_ALLOWANCE work
     * type during work shift hours calculation.
     * 
     * @type {boolean}
     * @memberof EmployeeWorkShift
     */
    dayOffWorkAllowance?: boolean;
    /**
     * 
     * @type {AbsenceType}
     * @memberof EmployeeWorkShift
     */
    absence?: AbsenceType;
    /**
     * 
     * @type {PerDiemAllowanceType}
     * @memberof EmployeeWorkShift
     */
    perDiemAllowance?: PerDiemAllowanceType;
    /**
     * Whether the work shift has been approved by a supervisor. Work shift hours cannot be updated if
     * the work shift is approved.
     * 
     * @type {boolean}
     * @memberof EmployeeWorkShift
     */
    approved: boolean;
    /**
     * Additional notes for the work shift. For example, if the employee was sick during the shift.
     * @type {string}
     * @memberof EmployeeWorkShift
     */
    notes?: string;
    /**
     * 
     * @type {string}
     * @memberof EmployeeWorkShift
     */
    defaultCostCenter?: string;
    /**
     * Payroll export ID. This is filled when work shift is linked to a payroll export. Work shift cannot be
     * included in another payroll export if it is already linked to one.
     * 
     * @type {string}
     * @memberof EmployeeWorkShift
     */
    readonly payrollExportId?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof EmployeeWorkShift
     */
    costCentersFromEvents: Array<string>;
}

/**
 * Check if a given object implements the EmployeeWorkShift interface.
 */
export function instanceOfEmployeeWorkShift(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "date" in value;
    isInstance = isInstance && "employeeId" in value;
    isInstance = isInstance && "approved" in value;
    isInstance = isInstance && "costCentersFromEvents" in value;

    return isInstance;
}

export function EmployeeWorkShiftFromJSON(json: any): EmployeeWorkShift {
    return EmployeeWorkShiftFromJSONTyped(json, false);
}

export function EmployeeWorkShiftFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmployeeWorkShift {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'date': (new Date(json['date'])),
        'startedAt': !exists(json, 'startedAt') ? undefined : (new Date(json['startedAt'])),
        'endedAt': !exists(json, 'endedAt') ? undefined : (new Date(json['endedAt'])),
        'employeeId': json['employeeId'],
        'truckIdsFromEvents': !exists(json, 'truckIdsFromEvents') ? undefined : json['truckIdsFromEvents'],
        'dayOffWorkAllowance': !exists(json, 'dayOffWorkAllowance') ? undefined : json['dayOffWorkAllowance'],
        'absence': !exists(json, 'absence') ? undefined : AbsenceTypeFromJSON(json['absence']),
        'perDiemAllowance': !exists(json, 'perDiemAllowance') ? undefined : PerDiemAllowanceTypeFromJSON(json['perDiemAllowance']),
        'approved': json['approved'],
        'notes': !exists(json, 'notes') ? undefined : json['notes'],
        'defaultCostCenter': !exists(json, 'defaultCostCenter') ? undefined : json['defaultCostCenter'],
        'payrollExportId': !exists(json, 'payrollExportId') ? undefined : json['payrollExportId'],
        'costCentersFromEvents': json['costCentersFromEvents'],
    };
}

export function EmployeeWorkShiftToJSON(value?: EmployeeWorkShift | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'date': (value.date.toISOString().substring(0,10)),
        'employeeId': value.employeeId,
        'dayOffWorkAllowance': value.dayOffWorkAllowance,
        'absence': AbsenceTypeToJSON(value.absence),
        'perDiemAllowance': PerDiemAllowanceTypeToJSON(value.perDiemAllowance),
        'approved': value.approved,
        'notes': value.notes,
        'defaultCostCenter': value.defaultCostCenter,
        'costCentersFromEvents': value.costCentersFromEvents,
    };
}

