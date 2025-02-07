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
    Holiday,
    HolidayFromJSON,
    HolidayToJSON,
} from '../models';
import { DateTime } from "luxon";
export interface CreateHolidayRequest {
    holiday: Holiday;
}
export interface DeleteHolidayRequest {
    holidayId: string;
}
export interface FindHolidayRequest {
    holidayId: string;
}
export interface ListHolidaysRequest {
    year?: number;
    first?: number;
    max?: number;
}
export interface UpdateHolidayRequest {
    holiday: Holiday;
    holidayId: string;
}
/**
 * 
 */
export class HolidaysApi extends runtime.BaseAPI {
    /**
     * Creates Holiday.
     * Create Holiday.
     */
    async createHolidayRaw(requestParameters: CreateHolidayRequest): Promise<runtime.ApiResponse<Holiday>> {
        if (requestParameters.holiday === null || requestParameters.holiday === undefined) {
            throw new runtime.RequiredError('holiday','Required parameter requestParameters.holiday was null or undefined when calling createHoliday.');
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
            path: `/user-management/v1/holidays`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HolidayToJSON(requestParameters.holiday),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => HolidayFromJSON(jsonValue));
    }
    /**
     * Creates Holiday.
     * Create Holiday.
     */
    async createHoliday(requestParameters: CreateHolidayRequest): Promise<Holiday> {
        const response = await this.createHolidayRaw(requestParameters);
        return await response.value();
    }
    /**
     * Creates Holiday.
     * Create Holiday.
     */
    async createHolidayWithHeaders(requestParameters: CreateHolidayRequest): Promise<[ Holiday, Headers ]> {
        const response = await this.createHolidayRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Deletes Holiday.
     * Delete Holiday.
     */
    async deleteHolidayRaw(requestParameters: DeleteHolidayRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.holidayId === null || requestParameters.holidayId === undefined) {
            throw new runtime.RequiredError('holidayId','Required parameter requestParameters.holidayId was null or undefined when calling deleteHoliday.');
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
            path: `/user-management/v1/holidays/{holidayId}`.replace(`{${"holidayId"}}`, encodeURIComponent(String(requestParameters.holidayId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Deletes Holiday.
     * Delete Holiday.
     */
    async deleteHoliday(requestParameters: DeleteHolidayRequest): Promise<void> {
        await this.deleteHolidayRaw(requestParameters);
    }
    /**
     * Deletes Holiday.
     * Delete Holiday.
     */
    async deleteHolidayWithHeaders(requestParameters: DeleteHolidayRequest): Promise<Headers> {
        const response = await this.deleteHolidayRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds an Holiday by ID.
     * Find an Holiday.
     */
    async findHolidayRaw(requestParameters: FindHolidayRequest): Promise<runtime.ApiResponse<Holiday>> {
        if (requestParameters.holidayId === null || requestParameters.holidayId === undefined) {
            throw new runtime.RequiredError('holidayId','Required parameter requestParameters.holidayId was null or undefined when calling findHoliday.');
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
            path: `/user-management/v1/holidays/{holidayId}`.replace(`{${"holidayId"}}`, encodeURIComponent(String(requestParameters.holidayId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => HolidayFromJSON(jsonValue));
    }
    /**
     * Finds an Holiday by ID.
     * Find an Holiday.
     */
    async findHoliday(requestParameters: FindHolidayRequest): Promise<Holiday> {
        const response = await this.findHolidayRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds an Holiday by ID.
     * Find an Holiday.
     */
    async findHolidayWithHeaders(requestParameters: FindHolidayRequest): Promise<[ Holiday, Headers ]> {
        const response = await this.findHolidayRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists holidays.
     * List Holidays.
     */
    async listHolidaysRaw(requestParameters: ListHolidaysRequest): Promise<runtime.ApiResponse<Array<Holiday>>> {
        const queryParameters: any = {};
        if (requestParameters.year !== undefined) {
            queryParameters['year'] = requestParameters.year;
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
            path: `/user-management/v1/holidays`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(HolidayFromJSON));
    }
    /**
     * Lists holidays.
     * List Holidays.
     */
    async listHolidays(requestParameters: ListHolidaysRequest = {}): Promise<Array<Holiday>> {
        const response = await this.listHolidaysRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists holidays.
     * List Holidays.
     */
    async listHolidaysWithHeaders(requestParameters: ListHolidaysRequest): Promise<[ Array<Holiday>, Headers ]> {
        const response = await this.listHolidaysRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates Holiday.
     * Update Holiday.
     */
    async updateHolidayRaw(requestParameters: UpdateHolidayRequest): Promise<runtime.ApiResponse<Holiday>> {
        if (requestParameters.holiday === null || requestParameters.holiday === undefined) {
            throw new runtime.RequiredError('holiday','Required parameter requestParameters.holiday was null or undefined when calling updateHoliday.');
        }
        if (requestParameters.holidayId === null || requestParameters.holidayId === undefined) {
            throw new runtime.RequiredError('holidayId','Required parameter requestParameters.holidayId was null or undefined when calling updateHoliday.');
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
            path: `/user-management/v1/holidays/{holidayId}`.replace(`{${"holidayId"}}`, encodeURIComponent(String(requestParameters.holidayId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: HolidayToJSON(requestParameters.holiday),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => HolidayFromJSON(jsonValue));
    }
    /**
     * Updates Holiday.
     * Update Holiday.
     */
    async updateHoliday(requestParameters: UpdateHolidayRequest): Promise<Holiday> {
        const response = await this.updateHolidayRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates Holiday.
     * Update Holiday.
     */
    async updateHolidayWithHeaders(requestParameters: UpdateHolidayRequest): Promise<[ Holiday, Headers ]> {
        const response = await this.updateHolidayRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
