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
 * List of paging policies that have been triggered for this incident
 * @export
 * @interface ThermalMonitorIncidentPagedPolicy
 */
export interface ThermalMonitorIncidentPagedPolicy {
    /**
     * Unique identified for the paged policy
     * @type {string}
     * @memberof ThermalMonitorIncidentPagedPolicy
     */
    readonly id?: string;
    /**
     * The ID of the incident that was triggered
     * @type {string}
     * @memberof ThermalMonitorIncidentPagedPolicy
     */
    readonly incidentId?: string;
    /**
     * The ID of the policy that was triggered
     * @type {string}
     * @memberof ThermalMonitorIncidentPagedPolicy
     */
    readonly policyId?: string;
    /**
     * The ID of the contact that was paged
     * @type {string}
     * @memberof ThermalMonitorIncidentPagedPolicy
     */
    readonly contactId?: string;
    /**
     * The time when the policy was triggered
     * @type {Date}
     * @memberof ThermalMonitorIncidentPagedPolicy
     */
    readonly time?: Date;
}

/**
 * Check if a given object implements the ThermalMonitorIncidentPagedPolicy interface.
 */
export function instanceOfThermalMonitorIncidentPagedPolicy(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ThermalMonitorIncidentPagedPolicyFromJSON(json: any): ThermalMonitorIncidentPagedPolicy {
    return ThermalMonitorIncidentPagedPolicyFromJSONTyped(json, false);
}

export function ThermalMonitorIncidentPagedPolicyFromJSONTyped(json: any, ignoreDiscriminator: boolean): ThermalMonitorIncidentPagedPolicy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'incidentId': !exists(json, 'incidentId') ? undefined : json['incidentId'],
        'policyId': !exists(json, 'policyId') ? undefined : json['policyId'],
        'contactId': !exists(json, 'contactId') ? undefined : json['contactId'],
        'time': !exists(json, 'time') ? undefined : (new Date(json['time'])),
    };
}

export function ThermalMonitorIncidentPagedPolicyToJSON(value?: ThermalMonitorIncidentPagedPolicy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}

