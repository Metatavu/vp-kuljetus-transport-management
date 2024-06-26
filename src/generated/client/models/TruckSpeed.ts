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
 * 
 * @export
 * @interface TruckSpeed
 */
export interface TruckSpeed {
    /**
     * Truck speed ID
     * @type {string}
     * @memberof TruckSpeed
     */
    readonly id?: string;
    /**
     * Timestamp for truck speed. Unix timestamp in milliseconds.
     * @type {number}
     * @memberof TruckSpeed
     */
    timestamp: number;
    /**
     * 
     * @type {number}
     * @memberof TruckSpeed
     */
    speed: number;
}

/**
 * Check if a given object implements the TruckSpeed interface.
 */
export function instanceOfTruckSpeed(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "timestamp" in value;
    isInstance = isInstance && "speed" in value;

    return isInstance;
}

export function TruckSpeedFromJSON(json: any): TruckSpeed {
    return TruckSpeedFromJSONTyped(json, false);
}

export function TruckSpeedFromJSONTyped(json: any, ignoreDiscriminator: boolean): TruckSpeed {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'timestamp': json['timestamp'],
        'speed': json['speed'],
    };
}

export function TruckSpeedToJSON(value?: TruckSpeed | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'timestamp': value.timestamp,
        'speed': value.speed,
    };
}

