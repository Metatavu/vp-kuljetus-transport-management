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
 * 
 * @export
 */
export const CompensationType = {
    PublicHolidayAllowance: 'PUBLIC_HOLIDAY_ALLOWANCE',
    DayOffWorkAllowance: 'DAY_OFF_WORK_ALLOWANCE'
} as const;
export type CompensationType = typeof CompensationType[keyof typeof CompensationType];


export function CompensationTypeFromJSON(json: any): CompensationType {
    return CompensationTypeFromJSONTyped(json, false);
}

export function CompensationTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): CompensationType {
    return json as CompensationType;
}

export function CompensationTypeToJSON(value?: CompensationType | null): any {
    return value as any;
}
