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
 * Aggregation of work hours for a salary period
 * 
 * @export
 * @interface SalaryPeriodTotalWorkHours
 */
export interface SalaryPeriodTotalWorkHours {
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    workingHours: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    workingTime: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    overTimeHalf: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    overTimeFull: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    waitingTime: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    eveningWork: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    nightWork: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    holiday: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    dayOffBonus: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    vacation: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    unpaid: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    compensatoryLeave: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    sickHours: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    responsibilities: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    trainingDuringWorkTime: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    fillingHours: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    partialDailyAllowance: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    fullDailyAllowance: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    breakHours: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    jobSpecificAllowance: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    frozenAllowance: number;
    /**
     * 
     * @type {Date}
     * @memberof SalaryPeriodTotalWorkHours
     */
    salaryPeriodStartDate: Date;
    /**
     * 
     * @type {Date}
     * @memberof SalaryPeriodTotalWorkHours
     */
    salaryPeriodEndDate: Date;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    amountOfWorkshifts: number;
    /**
     * 
     * @type {number}
     * @memberof SalaryPeriodTotalWorkHours
     */
    amountOfApprovedWorkshifts: number;
    /**
     * 
     * @type {string}
     * @memberof SalaryPeriodTotalWorkHours
     */
    employeeId: string;
}

/**
 * Check if a given object implements the SalaryPeriodTotalWorkHours interface.
 */
export function instanceOfSalaryPeriodTotalWorkHours(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "workingHours" in value;
    isInstance = isInstance && "workingTime" in value;
    isInstance = isInstance && "overTimeHalf" in value;
    isInstance = isInstance && "overTimeFull" in value;
    isInstance = isInstance && "waitingTime" in value;
    isInstance = isInstance && "eveningWork" in value;
    isInstance = isInstance && "nightWork" in value;
    isInstance = isInstance && "holiday" in value;
    isInstance = isInstance && "dayOffBonus" in value;
    isInstance = isInstance && "vacation" in value;
    isInstance = isInstance && "unpaid" in value;
    isInstance = isInstance && "compensatoryLeave" in value;
    isInstance = isInstance && "sickHours" in value;
    isInstance = isInstance && "responsibilities" in value;
    isInstance = isInstance && "trainingDuringWorkTime" in value;
    isInstance = isInstance && "fillingHours" in value;
    isInstance = isInstance && "partialDailyAllowance" in value;
    isInstance = isInstance && "fullDailyAllowance" in value;
    isInstance = isInstance && "breakHours" in value;
    isInstance = isInstance && "jobSpecificAllowance" in value;
    isInstance = isInstance && "frozenAllowance" in value;
    isInstance = isInstance && "salaryPeriodStartDate" in value;
    isInstance = isInstance && "salaryPeriodEndDate" in value;
    isInstance = isInstance && "amountOfWorkshifts" in value;
    isInstance = isInstance && "amountOfApprovedWorkshifts" in value;
    isInstance = isInstance && "employeeId" in value;

    return isInstance;
}

export function SalaryPeriodTotalWorkHoursFromJSON(json: any): SalaryPeriodTotalWorkHours {
    return SalaryPeriodTotalWorkHoursFromJSONTyped(json, false);
}

export function SalaryPeriodTotalWorkHoursFromJSONTyped(json: any, ignoreDiscriminator: boolean): SalaryPeriodTotalWorkHours {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'workingHours': json['workingHours'],
        'workingTime': json['workingTime'],
        'overTimeHalf': json['overTimeHalf'],
        'overTimeFull': json['overTimeFull'],
        'waitingTime': json['waitingTime'],
        'eveningWork': json['eveningWork'],
        'nightWork': json['nightWork'],
        'holiday': json['holiday'],
        'dayOffBonus': json['dayOffBonus'],
        'vacation': json['vacation'],
        'unpaid': json['unpaid'],
        'compensatoryLeave': json['compensatoryLeave'],
        'sickHours': json['sickHours'],
        'responsibilities': json['responsibilities'],
        'trainingDuringWorkTime': json['trainingDuringWorkTime'],
        'fillingHours': json['fillingHours'],
        'partialDailyAllowance': json['partialDailyAllowance'],
        'fullDailyAllowance': json['fullDailyAllowance'],
        'breakHours': json['breakHours'],
        'jobSpecificAllowance': json['jobSpecificAllowance'],
        'frozenAllowance': json['frozenAllowance'],
        'salaryPeriodStartDate': (new Date(json['salaryPeriodStartDate'])),
        'salaryPeriodEndDate': (new Date(json['salaryPeriodEndDate'])),
        'amountOfWorkshifts': json['amountOfWorkshifts'],
        'amountOfApprovedWorkshifts': json['amountOfApprovedWorkshifts'],
        'employeeId': json['employeeId'],
    };
}

export function SalaryPeriodTotalWorkHoursToJSON(value?: SalaryPeriodTotalWorkHours | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'workingHours': value.workingHours,
        'workingTime': value.workingTime,
        'overTimeHalf': value.overTimeHalf,
        'overTimeFull': value.overTimeFull,
        'waitingTime': value.waitingTime,
        'eveningWork': value.eveningWork,
        'nightWork': value.nightWork,
        'holiday': value.holiday,
        'dayOffBonus': value.dayOffBonus,
        'vacation': value.vacation,
        'unpaid': value.unpaid,
        'compensatoryLeave': value.compensatoryLeave,
        'sickHours': value.sickHours,
        'responsibilities': value.responsibilities,
        'trainingDuringWorkTime': value.trainingDuringWorkTime,
        'fillingHours': value.fillingHours,
        'partialDailyAllowance': value.partialDailyAllowance,
        'fullDailyAllowance': value.fullDailyAllowance,
        'breakHours': value.breakHours,
        'jobSpecificAllowance': value.jobSpecificAllowance,
        'frozenAllowance': value.frozenAllowance,
        'salaryPeriodStartDate': (value.salaryPeriodStartDate.toISOString().substring(0,10)),
        'salaryPeriodEndDate': (value.salaryPeriodEndDate.toISOString().substring(0,10)),
        'amountOfWorkshifts': value.amountOfWorkshifts,
        'amountOfApprovedWorkshifts': value.amountOfApprovedWorkshifts,
        'employeeId': value.employeeId,
    };
}

