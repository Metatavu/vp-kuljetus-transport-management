/* tslint:disable */
/* eslint-disable */
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
 * Represents single truck driver
 * @export
 * @interface Driver
 */
export interface Driver {
    /**
     * 
     * @type {string}
     * @memberof Driver
     */
    readonly id?: string;
    /**
     * Driver display name
     * @type {string}
     * @memberof Driver
     */
    displayName?: string;
}

/**
 * Check if a given object implements the Driver interface.
 */
export function instanceOfDriver(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function DriverFromJSON(json: any): Driver {
    return DriverFromJSONTyped(json, false);
}

export function DriverFromJSONTyped(json: any, ignoreDiscriminator: boolean): Driver {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
    };
}

export function DriverToJSON(value?: Driver | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'displayName': value.displayName,
    };
}

