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
 * Employee's salary group
 * Kuljettaja (Driver) - Should be default IF the employees office is not KOTKA
 * VP-Logistics (VPlogistics)
 * Office
 * Terminal
 * 
 * @export
 */
export const SalaryGroup = {
    Driver: 'DRIVER',
    Vplogistics: 'VPLOGISTICS',
    Office: 'OFFICE',
    Terminal: 'TERMINAL'
} as const;
export type SalaryGroup = typeof SalaryGroup[keyof typeof SalaryGroup];


export function SalaryGroupFromJSON(json: any): SalaryGroup {
    return SalaryGroupFromJSONTyped(json, false);
}

export function SalaryGroupFromJSONTyped(json: any, ignoreDiscriminator: boolean): SalaryGroup {
    return json as SalaryGroup;
}

export function SalaryGroupToJSON(value?: SalaryGroup | null): any {
    return value as any;
}

