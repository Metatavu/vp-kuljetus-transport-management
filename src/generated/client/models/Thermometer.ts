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
 * Represents a thermometer attached to a truck or towable
 * @export
 * @interface Thermometer
 */
export interface Thermometer {
    /**
     * Unique identifier for the thermometer
     * @type {string}
     * @memberof Thermometer
     */
    readonly id?: string;
    /**
     * Name of the thermometer
     * @type {string}
     * @memberof Thermometer
     */
    name?: string;
    /**
     * MAC address of the thermometer. It is unique and stays with the device.
     * @type {string}
     * @memberof Thermometer
     */
    macAddress: string;
    /**
     * The ID of the entity currently associated with the thermometer.
     * @type {string}
     * @memberof Thermometer
     */
    entityId: string;
    /**
     * The type of the entity to which the thermometer is attached (e.g., "towable", "truck", etc.)
     * @type {string}
     * @memberof Thermometer
     */
    entityType: ThermometerEntityTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof Thermometer
     */
    readonly creatorId?: string;
    /**
     * 
     * @type {Date}
     * @memberof Thermometer
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof Thermometer
     */
    readonly lastModifierId?: string;
    /**
     * 
     * @type {Date}
     * @memberof Thermometer
     */
    readonly modifiedAt?: Date;
    /**
     * Setting the archivedAt time marks the thermometer as archived. Thermometers marked as archived will not appear in list requests unless includeArchived filter is set to true. Archived thermometer cannot be updated, unless archivedAt is first set to null.
     * 
     * @type {Date}
     * @memberof Thermometer
     */
    archivedAt?: Date;
}


/**
 * @export
 */
export const ThermometerEntityTypeEnum = {
    Truck: 'truck',
    Towable: 'towable'
} as const;
export type ThermometerEntityTypeEnum = typeof ThermometerEntityTypeEnum[keyof typeof ThermometerEntityTypeEnum];


/**
 * Check if a given object implements the Thermometer interface.
 */
export function instanceOfThermometer(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "macAddress" in value;
    isInstance = isInstance && "entityId" in value;
    isInstance = isInstance && "entityType" in value;

    return isInstance;
}

export function ThermometerFromJSON(json: any): Thermometer {
    return ThermometerFromJSONTyped(json, false);
}

export function ThermometerFromJSONTyped(json: any, ignoreDiscriminator: boolean): Thermometer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'macAddress': json['macAddress'],
        'entityId': json['entityId'],
        'entityType': json['entityType'],
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastModifierId': !exists(json, 'lastModifierId') ? undefined : json['lastModifierId'],
        'modifiedAt': !exists(json, 'modifiedAt') ? undefined : (new Date(json['modifiedAt'])),
        'archivedAt': !exists(json, 'archivedAt') ? undefined : (new Date(json['archivedAt'])),
    };
}

export function ThermometerToJSON(value?: Thermometer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'macAddress': value.macAddress,
        'entityId': value.entityId,
        'entityType': value.entityType,
        'archivedAt': value.archivedAt === undefined ? undefined : (value.archivedAt.toISOString()),
    };
}
