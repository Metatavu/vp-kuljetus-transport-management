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
    WorkEvent,
    WorkEventFromJSON,
    WorkEventToJSON,
} from '../models';
import { DateTime } from "luxon";
export interface CreateEmployeeWorkEventRequest {
    workEvent: WorkEvent;
    employeeId: string;
}
export interface DeleteEmployeeWorkEventRequest {
    employeeId: string;
    workEventId: string;
}
export interface FindEmployeeWorkEventRequest {
    employeeId: string;
    workEventId: string;
}
export interface ListEmployeeWorkEventsRequest {
    employeeId: string;
    employeeWorkShiftId?: string;
    after?: Date;
    before?: Date;
    first?: number;
    max?: number;
}
export interface UpdateEmployeeWorkEventRequest {
    workEvent: WorkEvent;
    employeeId: string;
    workEventId: string;
    workShiftChangeSetId: string;
}
/**
 * 
 */
export class WorkEventsApi extends runtime.BaseAPI {
    /**
     * Creates Employees Work Event.  If the work event starts a new shift, a new employee work shift is also created automatically. 
     * Create Employees Work Event.
     */
    async createEmployeeWorkEventRaw(requestParameters: CreateEmployeeWorkEventRequest): Promise<runtime.ApiResponse<WorkEvent>> {
        if (requestParameters.workEvent === null || requestParameters.workEvent === undefined) {
            throw new runtime.RequiredError('workEvent','Required parameter requestParameters.workEvent was null or undefined when calling createEmployeeWorkEvent.');
        }
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling createEmployeeWorkEvent.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        headerParameters['Content-Type'] = 'application/json';
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager", "driver", "employee"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user-management/v1/employees/{employeeId}/workEvents`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: WorkEventToJSON(requestParameters.workEvent),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => WorkEventFromJSON(jsonValue));
    }
    /**
     * Creates Employees Work Event.  If the work event starts a new shift, a new employee work shift is also created automatically. 
     * Create Employees Work Event.
     */
    async createEmployeeWorkEvent(requestParameters: CreateEmployeeWorkEventRequest): Promise<WorkEvent> {
        const response = await this.createEmployeeWorkEventRaw(requestParameters);
        return await response.value();
    }
    /**
     * Creates Employees Work Event.  If the work event starts a new shift, a new employee work shift is also created automatically. 
     * Create Employees Work Event.
     */
    async createEmployeeWorkEventWithHeaders(requestParameters: CreateEmployeeWorkEventRequest): Promise<[ WorkEvent, Headers ]> {
        const response = await this.createEmployeeWorkEventRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Deletes Employee\'s Work Event. Only accessible by managers. If deleting the last remaining work event from an employee work shift, the shift and its related work shift hours should also be deleted. 
     * Delete Employee\'s Work Event.
     */
    async deleteEmployeeWorkEventRaw(requestParameters: DeleteEmployeeWorkEventRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling deleteEmployeeWorkEvent.');
        }
        if (requestParameters.workEventId === null || requestParameters.workEventId === undefined) {
            throw new runtime.RequiredError('workEventId','Required parameter requestParameters.workEventId was null or undefined when calling deleteEmployeeWorkEvent.');
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
            path: `/user-management/v1/employees/{employeeId}/workEvents/{workEventId}`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))).replace(`{${"workEventId"}}`, encodeURIComponent(String(requestParameters.workEventId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Deletes Employee\'s Work Event. Only accessible by managers. If deleting the last remaining work event from an employee work shift, the shift and its related work shift hours should also be deleted. 
     * Delete Employee\'s Work Event.
     */
    async deleteEmployeeWorkEvent(requestParameters: DeleteEmployeeWorkEventRequest): Promise<void> {
        await this.deleteEmployeeWorkEventRaw(requestParameters);
    }
    /**
     * Deletes Employee\'s Work Event. Only accessible by managers. If deleting the last remaining work event from an employee work shift, the shift and its related work shift hours should also be deleted. 
     * Delete Employee\'s Work Event.
     */
    async deleteEmployeeWorkEventWithHeaders(requestParameters: DeleteEmployeeWorkEventRequest): Promise<Headers> {
        const response = await this.deleteEmployeeWorkEventRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds an employee\'s work event by ID.
     * Find an employee\'s work event.
     */
    async findEmployeeWorkEventRaw(requestParameters: FindEmployeeWorkEventRequest): Promise<runtime.ApiResponse<WorkEvent>> {
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling findEmployeeWorkEvent.');
        }
        if (requestParameters.workEventId === null || requestParameters.workEventId === undefined) {
            throw new runtime.RequiredError('workEventId','Required parameter requestParameters.workEventId was null or undefined when calling findEmployeeWorkEvent.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager", "driver", "employee"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user-management/v1/employees/{employeeId}/workEvents/{workEventId}`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))).replace(`{${"workEventId"}}`, encodeURIComponent(String(requestParameters.workEventId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => WorkEventFromJSON(jsonValue));
    }
    /**
     * Finds an employee\'s work event by ID.
     * Find an employee\'s work event.
     */
    async findEmployeeWorkEvent(requestParameters: FindEmployeeWorkEventRequest): Promise<WorkEvent> {
        const response = await this.findEmployeeWorkEventRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds an employee\'s work event by ID.
     * Find an employee\'s work event.
     */
    async findEmployeeWorkEventWithHeaders(requestParameters: FindEmployeeWorkEventRequest): Promise<[ WorkEvent, Headers ]> {
        const response = await this.findEmployeeWorkEventRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Employees Work Events. Sort by time, latest first.
     * List Employees Work Events.
     */
    async listEmployeeWorkEventsRaw(requestParameters: ListEmployeeWorkEventsRequest): Promise<runtime.ApiResponse<Array<WorkEvent>>> {
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling listEmployeeWorkEvents.');
        }
        const queryParameters: any = {};
        if (requestParameters.employeeWorkShiftId !== undefined) {
            queryParameters['employeeWorkShiftId'] = requestParameters.employeeWorkShiftId;
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
            const tokenString = await token("BearerAuth", ["manager", "driver", "employee"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user-management/v1/employees/{employeeId}/workEvents`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(WorkEventFromJSON));
    }
    /**
     * Lists Employees Work Events. Sort by time, latest first.
     * List Employees Work Events.
     */
    async listEmployeeWorkEvents(requestParameters: ListEmployeeWorkEventsRequest): Promise<Array<WorkEvent>> {
        const response = await this.listEmployeeWorkEventsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Employees Work Events. Sort by time, latest first.
     * List Employees Work Events.
     */
    async listEmployeeWorkEventsWithHeaders(requestParameters: ListEmployeeWorkEventsRequest): Promise<[ Array<WorkEvent>, Headers ]> {
        const response = await this.listEmployeeWorkEventsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates Employee\'s Work Event.
     * Update Employee\'s Work Event.
     */
    async updateEmployeeWorkEventRaw(requestParameters: UpdateEmployeeWorkEventRequest): Promise<runtime.ApiResponse<WorkEvent>> {
        if (requestParameters.workEvent === null || requestParameters.workEvent === undefined) {
            throw new runtime.RequiredError('workEvent','Required parameter requestParameters.workEvent was null or undefined when calling updateEmployeeWorkEvent.');
        }
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling updateEmployeeWorkEvent.');
        }
        if (requestParameters.workEventId === null || requestParameters.workEventId === undefined) {
            throw new runtime.RequiredError('workEventId','Required parameter requestParameters.workEventId was null or undefined when calling updateEmployeeWorkEvent.');
        }
        if (requestParameters.workShiftChangeSetId === null || requestParameters.workShiftChangeSetId === undefined) {
            throw new runtime.RequiredError('workShiftChangeSetId','Required parameter requestParameters.workShiftChangeSetId was null or undefined when calling updateEmployeeWorkEvent.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        headerParameters['Content-Type'] = 'application/json';
        if (requestParameters.workShiftChangeSetId !== undefined && requestParameters.workShiftChangeSetId !== null) {
            headerParameters['WorkShiftChangeSetId'] = String(requestParameters.workShiftChangeSetId);
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager", "employee"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user-management/v1/employees/{employeeId}/workEvents/{workEventId}`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))).replace(`{${"workEventId"}}`, encodeURIComponent(String(requestParameters.workEventId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: WorkEventToJSON(requestParameters.workEvent),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => WorkEventFromJSON(jsonValue));
    }
    /**
     * Updates Employee\'s Work Event.
     * Update Employee\'s Work Event.
     */
    async updateEmployeeWorkEvent(requestParameters: UpdateEmployeeWorkEventRequest): Promise<WorkEvent> {
        const response = await this.updateEmployeeWorkEventRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates Employee\'s Work Event.
     * Update Employee\'s Work Event.
     */
    async updateEmployeeWorkEventWithHeaders(requestParameters: UpdateEmployeeWorkEventRequest): Promise<[ WorkEvent, Headers ]> {
        const response = await this.updateEmployeeWorkEventRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
