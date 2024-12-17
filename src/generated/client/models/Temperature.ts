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
 * Represents a single temperature reading from a thermometer
 * @export
 * @interface Temperature
 */
export interface Temperature {
    /**
     * Unique identifier for the temperature record
     * @type {string}
     * @memberof Temperature
     */
    readonly id?: string;
    /**
     * The ID of the thermometer from which the reading was taken
     * @type {string}
     * @memberof Temperature
     */
    thermometerId: string;
    /**
     * The temperature reading in Celsius or Fahrenheit (based on your requirement)
     * @type {number}
     * @memberof Temperature
     */
    value: number;
    /**
     * The timestamp when the temperature was recorded
     * @type {Date}
     * @memberof Temperature
     */
    timestamp: Date;
}

/**
 * Check if a given object implements the Temperature interface.
 */
export function instanceOfTemperature(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "thermometerId" in value;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "timestamp" in value;

    return isInstance;
}

export function TemperatureFromJSON(json: any): Temperature {
    return TemperatureFromJSONTyped(json, false);
}

export function TemperatureFromJSONTyped(json: any, ignoreDiscriminator: boolean): Temperature {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'thermometerId': json['thermometerId'],
        'value': json['value'],
        'timestamp': (new Date(json['timestamp'])),
    };
}

export function TemperatureToJSON(value?: Temperature | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'thermometerId': value.thermometerId,
        'value': value.value,
        'timestamp': (value.timestamp.toISOString()),
    };
}
