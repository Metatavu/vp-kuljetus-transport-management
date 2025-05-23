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

import * as runtime from '../runtime';
import {
    ThermalMonitorIncident,
    ThermalMonitorIncidentFromJSON,
    ThermalMonitorIncidentToJSON,
    ThermalMonitorIncidentStatus,
    ThermalMonitorIncidentStatusFromJSON,
    ThermalMonitorIncidentStatusToJSON,
} from '../models';
import { DateTime } from "luxon";
export interface ListThermalMonitorIncidentsRequest {
    monitorId?: string;
    thermometerId?: string;
    incidentStatus?: ThermalMonitorIncidentStatus;
    after?: Date;
    before?: Date;
    first?: number;
    max?: number;
}
export interface UpdateThermalMonitorIncidentRequest {
    thermalMonitorIncident: ThermalMonitorIncident;
    thermalMonitorIncidentId: string;
}
/**
 * 
 */
export class ThermalMonitorIncidentsApi extends runtime.BaseAPI {
    /**
     * Retrieve a list of all thermal monitor incidents.  Can optionally be filtered by monitor ID, thermometer ID, status, or time range. 
     * List thermal monitor incidents
     */
    async listThermalMonitorIncidentsRaw(requestParameters: ListThermalMonitorIncidentsRequest): Promise<runtime.ApiResponse<Array<ThermalMonitorIncident>>> {
        const queryParameters: any = {};
        if (requestParameters.monitorId !== undefined) {
            queryParameters['monitorId'] = requestParameters.monitorId;
        }
        if (requestParameters.thermometerId !== undefined) {
            queryParameters['thermometerId'] = requestParameters.thermometerId;
        }
        if (requestParameters.incidentStatus !== undefined) {
            queryParameters['incidentStatus'] = requestParameters.incidentStatus;
        }
        if (requestParameters.after !== undefined) {
            queryParameters['after'] = DateTime.fromJSDate(requestParameters.after as any).toISO();
        }
        if (requestParameters.before !== undefined) {
            queryParameters['before'] = DateTime.fromJSDate(requestParameters.before as any).toISO();
        }
        if (requestParameters.first !== undefined) {
            queryParameters['first'] = requestParameters.first;
        }
        if (requestParameters.max !== undefined) {
            queryParameters['max'] = requestParameters.max;
        }
        const headerParameters: runtime.HTTPHeaders = {};
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/monitoring/v1/thermalMonitorIncidents`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ThermalMonitorIncidentFromJSON));
    }
    /**
     * Retrieve a list of all thermal monitor incidents.  Can optionally be filtered by monitor ID, thermometer ID, status, or time range. 
     * List thermal monitor incidents
     */
    async listThermalMonitorIncidents(requestParameters: ListThermalMonitorIncidentsRequest = {}): Promise<Array<ThermalMonitorIncident>> {
        const response = await this.listThermalMonitorIncidentsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Retrieve a list of all thermal monitor incidents.  Can optionally be filtered by monitor ID, thermometer ID, status, or time range. 
     * List thermal monitor incidents
     */
    async listThermalMonitorIncidentsWithHeaders(requestParameters: ListThermalMonitorIncidentsRequest): Promise<[ Array<ThermalMonitorIncident>, Headers ]> {
        const response = await this.listThermalMonitorIncidentsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Update the details of a specific incident
     * Update thermal monitor incident
     */
    async updateThermalMonitorIncidentRaw(requestParameters: UpdateThermalMonitorIncidentRequest): Promise<runtime.ApiResponse<ThermalMonitorIncident>> {
        if (requestParameters.thermalMonitorIncident === null || requestParameters.thermalMonitorIncident === undefined) {
            throw new runtime.RequiredError('thermalMonitorIncident','Required parameter requestParameters.thermalMonitorIncident was null or undefined when calling updateThermalMonitorIncident.');
        }
        if (requestParameters.thermalMonitorIncidentId === null || requestParameters.thermalMonitorIncidentId === undefined) {
            throw new runtime.RequiredError('thermalMonitorIncidentId','Required parameter requestParameters.thermalMonitorIncidentId was null or undefined when calling updateThermalMonitorIncident.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        headerParameters['Content-Type'] = 'application/json';
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/monitoring/v1/thermalMonitorIncidents/{thermalMonitorIncidentId}`.replace(`{${"thermalMonitorIncidentId"}}`, encodeURIComponent(String(requestParameters.thermalMonitorIncidentId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ThermalMonitorIncidentToJSON(requestParameters.thermalMonitorIncident),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => ThermalMonitorIncidentFromJSON(jsonValue));
    }
    /**
     * Update the details of a specific incident
     * Update thermal monitor incident
     */
    async updateThermalMonitorIncident(requestParameters: UpdateThermalMonitorIncidentRequest): Promise<ThermalMonitorIncident> {
        const response = await this.updateThermalMonitorIncidentRaw(requestParameters);
        return await response.value();
    }
    /**
     * Update the details of a specific incident
     * Update thermal monitor incident
     */
    async updateThermalMonitorIncidentWithHeaders(requestParameters: UpdateThermalMonitorIncidentRequest): Promise<[ ThermalMonitorIncident, Headers ]> {
        const response = await this.updateThermalMonitorIncidentRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
