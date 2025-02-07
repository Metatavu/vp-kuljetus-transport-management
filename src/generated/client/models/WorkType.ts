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


/**
 * Work type of the work shift hours. A single work type represents aggregated value from
 * one or more work event types.
 * 
 * | name                   | finnish name         |
 * | ---------------------- | -------------------- |
 * | PAID_WORK              | Palkallinen työ      |
 * | BREAK                  | Tauko                |
 * | STANDBY                | Odotus               |
 * | EVENING_ALLOWANCE      | Iltatyö              |
 * | NIGHT_ALLOWANCE        | Yötyö                |
 * | HOLIDAY_ALLOWANCE      | Pyhälisä             |
 * | JOB_SPECIFIC_ALLOWANCE | Työkohtaisuuslisä    |
 * | FROZEN_ALLOWANCE       | Pakastelisä          |
 * | OFFICIAL_DUTIES        | Virkatehtävät        |
 * | SICK_LEAVE             | Sairasloma           |
 * | TRAINING               | Koulutus työajalla   |
 * | UNPAID                 | Palkaton             |
 * 
 * @export
 */
export const WorkType = {
    PaidWork: 'PAID_WORK',
    Break: 'BREAK',
    Standby: 'STANDBY',
    EveningAllowance: 'EVENING_ALLOWANCE',
    NightAllowance: 'NIGHT_ALLOWANCE',
    HolidayAllowance: 'HOLIDAY_ALLOWANCE',
    JobSpecificAllowance: 'JOB_SPECIFIC_ALLOWANCE',
    FrozenAllowance: 'FROZEN_ALLOWANCE',
    OfficialDuties: 'OFFICIAL_DUTIES',
    SickLeave: 'SICK_LEAVE',
    Training: 'TRAINING',
    Unpaid: 'UNPAID'
} as const;
export type WorkType = typeof WorkType[keyof typeof WorkType];


export function WorkTypeFromJSON(json: any): WorkType {
    return WorkTypeFromJSONTyped(json, false);
}

export function WorkTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkType {
    return json as WorkType;
}

export function WorkTypeToJSON(value?: WorkType | null): any {
    return value as any;
}

