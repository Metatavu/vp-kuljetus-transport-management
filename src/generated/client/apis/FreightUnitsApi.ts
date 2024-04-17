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
    FreightUnit,
    FreightUnitFromJSON,
    FreightUnitToJSON,
} from '../models';

export interface CreateFreightUnitRequest {
    freightUnit: FreightUnit;
}

export interface DeleteFreightUnitRequest {
    freightUnitId: string;
}

export interface FindFreightUnitRequest {
    freightUnitId: string;
}

export interface ListFreightUnitsRequest {
    freightId?: string;
    first?: number;
    max?: number;
}

export interface UpdateFreightUnitRequest {
    freightUnit: FreightUnit;
    freightUnitId: string;
}

/**
 * 
 */
export class FreightUnitsApi extends runtime.BaseAPI {
    /**
     * Create new freight unit
     * Create freight unit
     */
    async createFreightUnitRaw(requestParameters: CreateFreightUnitRequest): Promise<runtime.ApiResponse<FreightUnit>> {
        if (requestParameters.freightUnit === null || requestParameters.freightUnit === undefined) {
            throw new runtime.RequiredError('freightUnit','Required parameter requestParameters.freightUnit was null or undefined when calling createFreightUnit.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        headerParameters['Content-Type'] = 'application/json';
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["driver", "manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/delivery-info/v1/freightUnits`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FreightUnitToJSON(requestParameters.freightUnit),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => FreightUnitFromJSON(jsonValue));
    }
    /**
     * Create new freight unit
     * Create freight unit
     */
    async createFreightUnit(requestParameters: CreateFreightUnitRequest): Promise<FreightUnit> {
        const response = await this.createFreightUnitRaw(requestParameters);
        return await response.value();
    }
    /**
     * Create new freight unit
     * Create freight unit
     */
    async createFreightUnitWithHeaders(requestParameters: CreateFreightUnitRequest): Promise<[ FreightUnit, Headers ]> {
        const response = await this.createFreightUnitRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Deletes freight unit
     * Deletes freight unit
     */
    async deleteFreightUnitRaw(requestParameters: DeleteFreightUnitRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.freightUnitId === null || requestParameters.freightUnitId === undefined) {
            throw new runtime.RequiredError('freightUnitId','Required parameter requestParameters.freightUnitId was null or undefined when calling deleteFreightUnit.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/delivery-info/v1/freightUnits/{freightUnitId}`.replace(`{${"freightUnitId"}}`, encodeURIComponent(String(requestParameters.freightUnitId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Deletes freight unit
     * Deletes freight unit
     */
    async deleteFreightUnit(requestParameters: DeleteFreightUnitRequest): Promise<void> {
        await this.deleteFreightUnitRaw(requestParameters);
    }
    /**
     * Deletes freight unit
     * Deletes freight unit
     */
    async deleteFreightUnitWithHeaders(requestParameters: DeleteFreightUnitRequest): Promise<Headers> {
        const response = await this.deleteFreightUnitRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds a freight unit by id.
     * Find a freight unit.
     */
    async findFreightUnitRaw(requestParameters: FindFreightUnitRequest): Promise<runtime.ApiResponse<FreightUnit>> {
        if (requestParameters.freightUnitId === null || requestParameters.freightUnitId === undefined) {
            throw new runtime.RequiredError('freightUnitId','Required parameter requestParameters.freightUnitId was null or undefined when calling findFreightUnit.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["driver", "manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/delivery-info/v1/freightUnits/{freightUnitId}`.replace(`{${"freightUnitId"}}`, encodeURIComponent(String(requestParameters.freightUnitId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => FreightUnitFromJSON(jsonValue));
    }
    /**
     * Finds a freight unit by id.
     * Find a freight unit.
     */
    async findFreightUnit(requestParameters: FindFreightUnitRequest): Promise<FreightUnit> {
        const response = await this.findFreightUnitRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds a freight unit by id.
     * Find a freight unit.
     */
    async findFreightUnitWithHeaders(requestParameters: FindFreightUnitRequest): Promise<[ FreightUnit, Headers ]> {
        const response = await this.findFreightUnitRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists FreightUnits.
     * List FreightUnits.
     */
    async listFreightUnitsRaw(requestParameters: ListFreightUnitsRequest): Promise<runtime.ApiResponse<Array<FreightUnit>>> {
        const queryParameters: any = {};
        if (requestParameters.freightId !== undefined) {
            queryParameters['freightId'] = requestParameters.freightId;
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
            const tokenString = await token("BearerAuth", ["driver", "manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/delivery-info/v1/freightUnits`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FreightUnitFromJSON));
    }
    /**
     * Lists FreightUnits.
     * List FreightUnits.
     */
    async listFreightUnits(requestParameters: ListFreightUnitsRequest = {}): Promise<Array<FreightUnit>> {
        const response = await this.listFreightUnitsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists FreightUnits.
     * List FreightUnits.
     */
    async listFreightUnitsWithHeaders(requestParameters: ListFreightUnitsRequest): Promise<[ Array<FreightUnit>, Headers ]> {
        const response = await this.listFreightUnitsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates single freight unit
     * Updates freight unit
     */
    async updateFreightUnitRaw(requestParameters: UpdateFreightUnitRequest): Promise<runtime.ApiResponse<FreightUnit>> {
        if (requestParameters.freightUnit === null || requestParameters.freightUnit === undefined) {
            throw new runtime.RequiredError('freightUnit','Required parameter requestParameters.freightUnit was null or undefined when calling updateFreightUnit.');
        }
        if (requestParameters.freightUnitId === null || requestParameters.freightUnitId === undefined) {
            throw new runtime.RequiredError('freightUnitId','Required parameter requestParameters.freightUnitId was null or undefined when calling updateFreightUnit.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        headerParameters['Content-Type'] = 'application/json';
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["driver", "manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/delivery-info/v1/freightUnits/{freightUnitId}`.replace(`{${"freightUnitId"}}`, encodeURIComponent(String(requestParameters.freightUnitId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: FreightUnitToJSON(requestParameters.freightUnit),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => FreightUnitFromJSON(jsonValue));
    }
    /**
     * Updates single freight unit
     * Updates freight unit
     */
    async updateFreightUnit(requestParameters: UpdateFreightUnitRequest): Promise<FreightUnit> {
        const response = await this.updateFreightUnitRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates single freight unit
     * Updates freight unit
     */
    async updateFreightUnitWithHeaders(requestParameters: UpdateFreightUnitRequest): Promise<[ FreightUnit, Headers ]> {
        const response = await this.updateFreightUnitRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
