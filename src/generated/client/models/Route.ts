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
 * Represent single planned route for single truck driver
 * @export
 * @interface Route
 */
export interface Route {
    /**
     * 
     * @type {string}
     * @memberof Route
     */
    readonly id?: string;
    /**
     * Vehicle id
     * @type {string}
     * @memberof Route
     */
    vehicleId?: string;
    /**
     * Driver id
     * @type {string}
     * @memberof Route
     */
    driverId?: string;
}

/**
 * Check if a given object implements the Route interface.
 */
export function instanceOfRoute(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RouteFromJSON(json: any): Route {
    return RouteFromJSONTyped(json, false);
}

export function RouteFromJSONTyped(json: any, ignoreDiscriminator: boolean): Route {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'vehicleId': !exists(json, 'vehicleId') ? undefined : json['vehicleId'],
        'driverId': !exists(json, 'driverId') ? undefined : json['driverId'],
    };
}

export function RouteToJSON(value?: Route | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'vehicleId': value.vehicleId,
        'driverId': value.driverId,
    };
}

