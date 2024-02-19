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
    Truck,
    TruckFromJSON,
    TruckToJSON,
} from '../models';

export interface CreateTruckRequest {
    truck: Truck;
}

export interface FindTruckRequest {
    truckId: string;
}

export interface ListTrucksRequest {
    plateNumber?: string;
    archived?: boolean;
    first?: number;
    max?: number;
}

export interface UpdateTruckRequest {
    truck: Truck;
    truckId: string;
}

/**
 * 
 */
export class TrucksApi extends runtime.BaseAPI {
    /**
     * Create new truck
     * Create truck
     */
    async createTruckRaw(requestParameters: CreateTruckRequest): Promise<runtime.ApiResponse<Truck>> {
        if (requestParameters.truck === null || requestParameters.truck === undefined) {
            throw new runtime.RequiredError('truck','Required parameter requestParameters.truck was null or undefined when calling createTruck.');
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
            path: `/vehicle-management/v1/trucks`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TruckToJSON(requestParameters.truck),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TruckFromJSON(jsonValue));
    }
    /**
     * Create new truck
     * Create truck
     */
    async createTruck(requestParameters: CreateTruckRequest): Promise<Truck> {
        const response = await this.createTruckRaw(requestParameters);
        return await response.value();
    }
    /**
     * Create new truck
     * Create truck
     */
    async createTruckWithHeaders(requestParameters: CreateTruckRequest): Promise<[ Truck, Headers ]> {
        const response = await this.createTruckRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Finds a truck by id.
     * Find a truck.
     */
    async findTruckRaw(requestParameters: FindTruckRequest): Promise<runtime.ApiResponse<Truck>> {
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling findTruck.');
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
            path: `/vehicle-management/v1/trucks/{truckId}`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TruckFromJSON(jsonValue));
    }
    /**
     * Finds a truck by id.
     * Find a truck.
     */
    async findTruck(requestParameters: FindTruckRequest): Promise<Truck> {
        const response = await this.findTruckRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds a truck by id.
     * Find a truck.
     */
    async findTruckWithHeaders(requestParameters: FindTruckRequest): Promise<[ Truck, Headers ]> {
        const response = await this.findTruckRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Trucks.
     * List Trucks.
     */
    async listTrucksRaw(requestParameters: ListTrucksRequest): Promise<runtime.ApiResponse<Array<Truck>>> {
        const queryParameters: any = {};
        if (requestParameters.plateNumber !== undefined) {
            queryParameters['plateNumber'] = requestParameters.plateNumber;
        }
        if (requestParameters.archived !== undefined) {
            queryParameters['archived'] = requestParameters.archived;
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
            path: `/vehicle-management/v1/trucks`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TruckFromJSON));
    }
    /**
     * Lists Trucks.
     * List Trucks.
     */
    async listTrucks(requestParameters: ListTrucksRequest = {}): Promise<Array<Truck>> {
        const response = await this.listTrucksRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Trucks.
     * List Trucks.
     */
    async listTrucksWithHeaders(requestParameters: ListTrucksRequest): Promise<[ Array<Truck>, Headers ]> {
        const response = await this.listTrucksRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates single truck
     * Updates trucks
     */
    async updateTruckRaw(requestParameters: UpdateTruckRequest): Promise<runtime.ApiResponse<Truck>> {
        if (requestParameters.truck === null || requestParameters.truck === undefined) {
            throw new runtime.RequiredError('truck','Required parameter requestParameters.truck was null or undefined when calling updateTruck.');
        }
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling updateTruck.');
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
            path: `/vehicle-management/v1/trucks/{truckId}`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: TruckToJSON(requestParameters.truck),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TruckFromJSON(jsonValue));
    }
    /**
     * Updates single truck
     * Updates trucks
     */
    async updateTruck(requestParameters: UpdateTruckRequest): Promise<Truck> {
        const response = await this.updateTruckRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates single truck
     * Updates trucks
     */
    async updateTruckWithHeaders(requestParameters: UpdateTruckRequest): Promise<[ Truck, Headers ]> {
        const response = await this.updateTruckRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
