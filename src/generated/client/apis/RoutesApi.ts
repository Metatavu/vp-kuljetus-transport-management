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
    Route,
    RouteFromJSON,
    RouteToJSON,
} from '../models';

export interface CreateRouteRequest {
    route: Route;
}

export interface DeleteRouteRequest {
    routeId: string;
}

export interface FindRouteRequest {
    routeId: string;
}

export interface ListRoutesRequest {
    truckId?: string;
    driverId?: string;
    departureAfter?: Date;
    departureBefore?: Date;
    first?: number;
    max?: number;
}

export interface UpdateRouteRequest {
    route: Route;
    routeId: string;
}

/**
 * 
 */
export class RoutesApi extends runtime.BaseAPI {
    /**
     * Create new route
     * Create route
     */
    async createRouteRaw(requestParameters: CreateRouteRequest): Promise<runtime.ApiResponse<Route>> {
        if (requestParameters.route === null || requestParameters.route === undefined) {
            throw new runtime.RequiredError('route','Required parameter requestParameters.route was null or undefined when calling createRoute.');
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
            path: `/work-planning/v1/routes`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RouteToJSON(requestParameters.route),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => RouteFromJSON(jsonValue));
    }
    /**
     * Create new route
     * Create route
     */
    async createRoute(requestParameters: CreateRouteRequest): Promise<Route> {
        const response = await this.createRouteRaw(requestParameters);
        return await response.value();
    }
    /**
     * Create new route
     * Create route
     */
    async createRouteWithHeaders(requestParameters: CreateRouteRequest): Promise<[ Route, Headers ]> {
        const response = await this.createRouteRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Deletes route
     * Deletes route
     */
    async deleteRouteRaw(requestParameters: DeleteRouteRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.routeId === null || requestParameters.routeId === undefined) {
            throw new runtime.RequiredError('routeId','Required parameter requestParameters.routeId was null or undefined when calling deleteRoute.');
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
            path: `/work-planning/v1/routes/{routeId}`.replace(`{${"routeId"}}`, encodeURIComponent(String(requestParameters.routeId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Deletes route
     * Deletes route
     */
    async deleteRoute(requestParameters: DeleteRouteRequest): Promise<void> {
        await this.deleteRouteRaw(requestParameters);
    }
    /**
     * Deletes route
     * Deletes route
     */
    async deleteRouteWithHeaders(requestParameters: DeleteRouteRequest): Promise<Headers> {
        const response = await this.deleteRouteRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds a route by id.
     * Find a route.
     */
    async findRouteRaw(requestParameters: FindRouteRequest): Promise<runtime.ApiResponse<Route>> {
        if (requestParameters.routeId === null || requestParameters.routeId === undefined) {
            throw new runtime.RequiredError('routeId','Required parameter requestParameters.routeId was null or undefined when calling findRoute.');
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
            path: `/work-planning/v1/routes/{routeId}`.replace(`{${"routeId"}}`, encodeURIComponent(String(requestParameters.routeId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => RouteFromJSON(jsonValue));
    }
    /**
     * Finds a route by id.
     * Find a route.
     */
    async findRoute(requestParameters: FindRouteRequest): Promise<Route> {
        const response = await this.findRouteRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds a route by id.
     * Find a route.
     */
    async findRouteWithHeaders(requestParameters: FindRouteRequest): Promise<[ Route, Headers ]> {
        const response = await this.findRouteRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Routes.
     * List Routes.
     */
    async listRoutesRaw(requestParameters: ListRoutesRequest): Promise<runtime.ApiResponse<Array<Route>>> {
        const queryParameters: any = {};
        if (requestParameters.truckId !== undefined) {
            queryParameters['truckId'] = requestParameters.truckId;
        }
        if (requestParameters.driverId !== undefined) {
            queryParameters['driverId'] = requestParameters.driverId;
        }
        if (requestParameters.departureAfter !== undefined) {
            queryParameters['departureAfter'] = (requestParameters.departureAfter as any).toISOString();
        }
        if (requestParameters.departureBefore !== undefined) {
            queryParameters['departureBefore'] = (requestParameters.departureBefore as any).toISOString();
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
            path: `/work-planning/v1/routes`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RouteFromJSON));
    }
    /**
     * Lists Routes.
     * List Routes.
     */
    async listRoutes(requestParameters: ListRoutesRequest = {}): Promise<Array<Route>> {
        const response = await this.listRoutesRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Routes.
     * List Routes.
     */
    async listRoutesWithHeaders(requestParameters: ListRoutesRequest): Promise<[ Array<Route>, Headers ]> {
        const response = await this.listRoutesRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates single route
     * Updates routes
     */
    async updateRouteRaw(requestParameters: UpdateRouteRequest): Promise<runtime.ApiResponse<Route>> {
        if (requestParameters.route === null || requestParameters.route === undefined) {
            throw new runtime.RequiredError('route','Required parameter requestParameters.route was null or undefined when calling updateRoute.');
        }
        if (requestParameters.routeId === null || requestParameters.routeId === undefined) {
            throw new runtime.RequiredError('routeId','Required parameter requestParameters.routeId was null or undefined when calling updateRoute.');
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
            path: `/work-planning/v1/routes/{routeId}`.replace(`{${"routeId"}}`, encodeURIComponent(String(requestParameters.routeId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: RouteToJSON(requestParameters.route),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => RouteFromJSON(jsonValue));
    }
    /**
     * Updates single route
     * Updates routes
     */
    async updateRoute(requestParameters: UpdateRouteRequest): Promise<Route> {
        const response = await this.updateRouteRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates single route
     * Updates routes
     */
    async updateRouteWithHeaders(requestParameters: UpdateRouteRequest): Promise<[ Route, Headers ]> {
        const response = await this.updateRouteRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
