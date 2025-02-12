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
 * Employee's type described as finnish abbreviation. UI implementations should translate these to more human readable form.
 * 
 * | Abbreviation | finnish name            |
 * | ------------ | ----------------------- |
 * | PA           | Pakettiautonkuljettaja  |
 * | KA           | Kuorma-auton kuljettaja |
 * | AH           | Alihankkija             |
 * | VK           | Vuokratyöntekijä        |
 * | TH           | Työharjoittelija        |
 * | TP           | Tilapäistyöntekijä      |
 * | AJ           | Ajojärjestelijä         |
 * | JH           | Esimies                 |
 * | AP           | Aikatuntipalkka         |
 * | KK           | Kuukausipalkka          |
 * | POIS         | Ei-aktiivinen           |
 * | TPK          | Täysperäkuljettaja      |
 * 
 * @export
 */
export const EmployeeType = {
    Pa: 'PA',
    Ka: 'KA',
    Ah: 'AH',
    Vk: 'VK',
    Th: 'TH',
    Tp: 'TP',
    Aj: 'AJ',
    Jh: 'JH',
    Ap: 'AP',
    Kk: 'KK',
    Pois: 'POIS',
    Tpk: 'TPK'
} as const;
export type EmployeeType = typeof EmployeeType[keyof typeof EmployeeType];


export function EmployeeTypeFromJSON(json: any): EmployeeType {
    return EmployeeTypeFromJSONTyped(json, false);
}

export function EmployeeTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmployeeType {
    return json as EmployeeType;
}

export function EmployeeTypeToJSON(value?: EmployeeType | null): any {
    return value as any;
}

