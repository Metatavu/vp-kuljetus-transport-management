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
 * Work event types. UI implementations should translate these to more human readable form.
 * 
 * *Driver work types*
 * | name                 | finnish name               |
 * | -------------------- | -------------------------- |
 * | DRIVE                | Ajo                        |
 * | LOADING              | Lastaus                    |
 * | UNLOADING            | Purku                      |
 * | AVAILABILITY         | Saatavuus                  |
 * | DRIVER_CARD_INSERTED | Kuljettajakortti syötetty  |
 * | DRIVER_CARD_REMOVED  | Kuljettajakortti poistettu |
 * 
 * *Office/Terminal work types*
 * | name        | finnish name         |
 * | ----------- | -------------------- |
 * | VEGETABLE   | Hevi                 |
 * | DRY         | Kuiva                |
 * | MEAT_CELLAR | Lihakellari          |
 * | MEIRA       | Meira                |
 * | FROZEN      | Pakaste              |
 * | PALTE       | Palte                |
 * | BREWERY     | Panimo               |
 * | GREASE      | Rasva                |
 * | OFFICE      | Toimisto             |
 * | LOGIN       | Sisäänkirjautuminen  |
 * | LOGOUT      | Uloskirjautuminen    |
 * 
 * *Common work types*
 * | name        | finnish name         |
 * | ----------- | -------------------- |
 * | OTHER_WORK  | Muu työ              |
 * | BREAK       | Tauko                |
 * | SHIFT_START | Työvuoron alku       |
 * | SHIFT_END   | Työvuoron loppu      |
 * | UNKNOWN     | Tuntematon           |
 * 
 * @export
 */
export const WorkEventType = {
    Vegetable: 'VEGETABLE',
    Dry: 'DRY',
    MeatCellar: 'MEAT_CELLAR',
    Meira: 'MEIRA',
    Frozen: 'FROZEN',
    Palte: 'PALTE',
    Brewery: 'BREWERY',
    Grease: 'GREASE',
    Office: 'OFFICE',
    Login: 'LOGIN',
    Logout: 'LOGOUT',
    OtherWork: 'OTHER_WORK',
    Break: 'BREAK',
    ShiftStart: 'SHIFT_START',
    ShiftEnd: 'SHIFT_END',
    Unknown: 'UNKNOWN',
    Drive: 'DRIVE',
    Loading: 'LOADING',
    Unloading: 'UNLOADING',
    Availability: 'AVAILABILITY',
    DriverCardInserted: 'DRIVER_CARD_INSERTED',
    DriverCardRemoved: 'DRIVER_CARD_REMOVED'
} as const;
export type WorkEventType = typeof WorkEventType[keyof typeof WorkEventType];


export function WorkEventTypeFromJSON(json: any): WorkEventType {
    return WorkEventTypeFromJSONTyped(json, false);
}

export function WorkEventTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkEventType {
    return json as WorkEventType;
}

export function WorkEventTypeToJSON(value?: WorkEventType | null): any {
    return value as any;
}

