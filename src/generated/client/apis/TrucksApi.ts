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
    SortOrder,
    SortOrderFromJSON,
    SortOrderToJSON,
    Truck,
    TruckFromJSON,
    TruckToJSON,
    TruckDriveState,
    TruckDriveStateFromJSON,
    TruckDriveStateToJSON,
    TruckDriveStateEnum,
    TruckDriveStateEnumFromJSON,
    TruckDriveStateEnumToJSON,
    TruckLocation,
    TruckLocationFromJSON,
    TruckLocationToJSON,
    TruckOdometerReading,
    TruckOdometerReadingFromJSON,
    TruckOdometerReadingToJSON,
    TruckOrTowableTemperature,
    TruckOrTowableTemperatureFromJSON,
    TruckOrTowableTemperatureToJSON,
    TruckSortByField,
    TruckSortByFieldFromJSON,
    TruckSortByFieldToJSON,
    TruckSpeed,
    TruckSpeedFromJSON,
    TruckSpeedToJSON,
} from '../models';

export interface CreateTruckRequest {
    truck: Truck;
}

export interface FindTruckRequest {
    truckId: string;
}

export interface ListDriveStatesRequest {
    truckId: string;
    driverId?: string;
    state?: Array<TruckDriveStateEnum>;
    after?: Date;
    before?: Date;
    first?: number;
    max?: number;
}

export interface ListTruckLocationsRequest {
    truckId: string;
    after?: Date;
    before?: Date;
    first?: number;
    max?: number;
}

export interface ListTruckOdometerReadingsRequest {
    truckId: string;
    after?: Date;
    before?: Date;
    first?: number;
    max?: number;
}

export interface ListTruckSpeedsRequest {
    truckId: string;
    after?: Date;
    before?: Date;
    first?: number;
    max?: number;
}

export interface ListTruckTemperaturesRequest {
    truckId: string;
    includeArchived?: boolean;
    first?: number;
    max?: number;
}

export interface ListTrucksRequest {
    plateNumber?: string;
    archived?: boolean;
    sortBy?: TruckSortByField;
    sortDirection?: SortOrder;
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
     * Lists drive states for truck.
     * List drive states.
     */
    async listDriveStatesRaw(requestParameters: ListDriveStatesRequest): Promise<runtime.ApiResponse<Array<TruckDriveState>>> {
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling listDriveStates.');
        }
        const queryParameters: any = {};
        if (requestParameters.driverId !== undefined) {
            queryParameters['driverId'] = requestParameters.driverId;
        }
        if (requestParameters.state) {
            queryParameters['state'] = requestParameters.state;
        }
        if (requestParameters.after !== undefined) {
            queryParameters['after'] = (requestParameters.after as any).toISOString();
        }
        if (requestParameters.before !== undefined) {
            queryParameters['before'] = (requestParameters.before as any).toISOString();
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
            path: `/vehicle-management/v1/trucks/{truckId}/driveStates`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TruckDriveStateFromJSON));
    }
    /**
     * Lists drive states for truck.
     * List drive states.
     */
    async listDriveStates(requestParameters: ListDriveStatesRequest): Promise<Array<TruckDriveState>> {
        const response = await this.listDriveStatesRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists drive states for truck.
     * List drive states.
     */
    async listDriveStatesWithHeaders(requestParameters: ListDriveStatesRequest): Promise<[ Array<TruckDriveState>, Headers ]> {
        const response = await this.listDriveStatesRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Truck locations.
     * List Truck locations
     */
    async listTruckLocationsRaw(requestParameters: ListTruckLocationsRequest): Promise<runtime.ApiResponse<Array<TruckLocation>>> {
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling listTruckLocations.');
        }
        const queryParameters: any = {};
        if (requestParameters.after !== undefined) {
            queryParameters['after'] = (requestParameters.after as any).toISOString();
        }
        if (requestParameters.before !== undefined) {
            queryParameters['before'] = (requestParameters.before as any).toISOString();
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
            path: `/vehicle-management/v1/trucks/{truckId}/locations`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TruckLocationFromJSON));
    }
    /**
     * Lists Truck locations.
     * List Truck locations
     */
    async listTruckLocations(requestParameters: ListTruckLocationsRequest): Promise<Array<TruckLocation>> {
        const response = await this.listTruckLocationsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Truck locations.
     * List Truck locations
     */
    async listTruckLocationsWithHeaders(requestParameters: ListTruckLocationsRequest): Promise<[ Array<TruckLocation>, Headers ]> {
        const response = await this.listTruckLocationsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists truck odometer readings.
     * List truck odometer readings
     */
    async listTruckOdometerReadingsRaw(requestParameters: ListTruckOdometerReadingsRequest): Promise<runtime.ApiResponse<Array<TruckOdometerReading>>> {
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling listTruckOdometerReadings.');
        }
        const queryParameters: any = {};
        if (requestParameters.after !== undefined) {
            queryParameters['after'] = (requestParameters.after as any).toISOString();
        }
        if (requestParameters.before !== undefined) {
            queryParameters['before'] = (requestParameters.before as any).toISOString();
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
            path: `/vehicle-management/v1/trucks/{truckId}/odometerReadings`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TruckOdometerReadingFromJSON));
    }
    /**
     * Lists truck odometer readings.
     * List truck odometer readings
     */
    async listTruckOdometerReadings(requestParameters: ListTruckOdometerReadingsRequest): Promise<Array<TruckOdometerReading>> {
        const response = await this.listTruckOdometerReadingsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists truck odometer readings.
     * List truck odometer readings
     */
    async listTruckOdometerReadingsWithHeaders(requestParameters: ListTruckOdometerReadingsRequest): Promise<[ Array<TruckOdometerReading>, Headers ]> {
        const response = await this.listTruckOdometerReadingsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Truck speeds.
     * List Truck speeds
     */
    async listTruckSpeedsRaw(requestParameters: ListTruckSpeedsRequest): Promise<runtime.ApiResponse<Array<TruckSpeed>>> {
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling listTruckSpeeds.');
        }
        const queryParameters: any = {};
        if (requestParameters.after !== undefined) {
            queryParameters['after'] = (requestParameters.after as any).toISOString();
        }
        if (requestParameters.before !== undefined) {
            queryParameters['before'] = (requestParameters.before as any).toISOString();
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
            path: `/vehicle-management/v1/trucks/{truckId}/speeds`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TruckSpeedFromJSON));
    }
    /**
     * Lists Truck speeds.
     * List Truck speeds
     */
    async listTruckSpeeds(requestParameters: ListTruckSpeedsRequest): Promise<Array<TruckSpeed>> {
        const response = await this.listTruckSpeedsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Truck speeds.
     * List Truck speeds
     */
    async listTruckSpeedsWithHeaders(requestParameters: ListTruckSpeedsRequest): Promise<[ Array<TruckSpeed>, Headers ]> {
        const response = await this.listTruckSpeedsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Retrieve all temperatures from all thermometers related to a specific truck, possibly including data from archived thermometers.
     * List truck temperatures.
     */
    async listTruckTemperaturesRaw(requestParameters: ListTruckTemperaturesRequest): Promise<runtime.ApiResponse<Array<TruckOrTowableTemperature>>> {
        if (requestParameters.truckId === null || requestParameters.truckId === undefined) {
            throw new runtime.RequiredError('truckId','Required parameter requestParameters.truckId was null or undefined when calling listTruckTemperatures.');
        }
        const queryParameters: any = {};
        if (requestParameters.includeArchived !== undefined) {
            queryParameters['includeArchived'] = requestParameters.includeArchived;
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
            path: `/vehicle-management/v1/trucks/{truckId}/temperatures`.replace(`{${"truckId"}}`, encodeURIComponent(String(requestParameters.truckId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TruckOrTowableTemperatureFromJSON));
    }
    /**
     * Retrieve all temperatures from all thermometers related to a specific truck, possibly including data from archived thermometers.
     * List truck temperatures.
     */
    async listTruckTemperatures(requestParameters: ListTruckTemperaturesRequest): Promise<Array<TruckOrTowableTemperature>> {
        const response = await this.listTruckTemperaturesRaw(requestParameters);
        return await response.value();
    }
    /**
     * Retrieve all temperatures from all thermometers related to a specific truck, possibly including data from archived thermometers.
     * List truck temperatures.
     */
    async listTruckTemperaturesWithHeaders(requestParameters: ListTruckTemperaturesRequest): Promise<[ Array<TruckOrTowableTemperature>, Headers ]> {
        const response = await this.listTruckTemperaturesRaw(requestParameters);
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
        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }
        if (requestParameters.sortDirection !== undefined) {
            queryParameters['sortDirection'] = requestParameters.sortDirection;
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
