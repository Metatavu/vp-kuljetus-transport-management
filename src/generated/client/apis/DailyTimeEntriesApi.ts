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
    DailyTimeEntry,
    DailyTimeEntryFromJSON,
    DailyTimeEntryToJSON,
    TimeEntry,
    TimeEntryFromJSON,
    TimeEntryToJSON,
    WorkEventType,
    WorkEventTypeFromJSON,
    WorkEventTypeToJSON,
} from '../models';

export interface CreateEmployeeDailyTimeEntryRequest {
    dailyTimeEntry: DailyTimeEntry;
    employeeId: string;
}

export interface DeleteEmployeeDailyTimeEntryRequest {
    employeeId: string;
    dailyTimeEntryId: string;
}

export interface FindEmployeeDailyTimeEntryRequest {
    employeeId: string;
    dailyTimeEntryId: string;
}

export interface ListEmployeeDailyTimeEntriesRequest {
    employeeId: string;
    workEventType?: WorkEventType;
    start?: Date;
    end?: Date;
    first?: number;
    max?: number;
}

export interface UpdateEmployeeDailyTimeEntryRequest {
    dailyTimeEntry: DailyTimeEntry;
    employeeId: string;
    dailyTimeEntryId: string;
}

/**
 * 
 */
export class DailyTimeEntriesApi extends runtime.BaseAPI {
    /**
     * Creates Employees Daily Time Entry.  Attempt to create new daily time entry should fail if a daily entry with the same date and work type already exists. 
     * Create Employees Daily Time Entry.
     */
    async createEmployeeDailyTimeEntryRaw(requestParameters: CreateEmployeeDailyTimeEntryRequest): Promise<runtime.ApiResponse<TimeEntry>> {
        if (requestParameters.dailyTimeEntry === null || requestParameters.dailyTimeEntry === undefined) {
            throw new runtime.RequiredError('dailyTimeEntry','Required parameter requestParameters.dailyTimeEntry was null or undefined when calling createEmployeeDailyTimeEntry.');
        }
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling createEmployeeDailyTimeEntry.');
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
            path: `/user-management/v1/employees/{employeeId}/dailyTimeEntries`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DailyTimeEntryToJSON(requestParameters.dailyTimeEntry),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TimeEntryFromJSON(jsonValue));
    }
    /**
     * Creates Employees Daily Time Entry.  Attempt to create new daily time entry should fail if a daily entry with the same date and work type already exists. 
     * Create Employees Daily Time Entry.
     */
    async createEmployeeDailyTimeEntry(requestParameters: CreateEmployeeDailyTimeEntryRequest): Promise<TimeEntry> {
        const response = await this.createEmployeeDailyTimeEntryRaw(requestParameters);
        return await response.value();
    }
    /**
     * Creates Employees Daily Time Entry.  Attempt to create new daily time entry should fail if a daily entry with the same date and work type already exists. 
     * Create Employees Daily Time Entry.
     */
    async createEmployeeDailyTimeEntryWithHeaders(requestParameters: CreateEmployeeDailyTimeEntryRequest): Promise<[ TimeEntry, Headers ]> {
        const response = await this.createEmployeeDailyTimeEntryRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Deletes Employee\'s Daily Time Entry.
     * Delete Employee\'s Daily Time Entry.
     */
    async deleteEmployeeDailyTimeEntryRaw(requestParameters: DeleteEmployeeDailyTimeEntryRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling deleteEmployeeDailyTimeEntry.');
        }
        if (requestParameters.dailyTimeEntryId === null || requestParameters.dailyTimeEntryId === undefined) {
            throw new runtime.RequiredError('dailyTimeEntryId','Required parameter requestParameters.dailyTimeEntryId was null or undefined when calling deleteEmployeeDailyTimeEntry.');
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
            path: `/user-management/v1/employees/{employeeId}/dailyTimeEntries/{dailyTimeEntryId}`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))).replace(`{${"dailyTimeEntryId"}}`, encodeURIComponent(String(requestParameters.dailyTimeEntryId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Deletes Employee\'s Daily Time Entry.
     * Delete Employee\'s Daily Time Entry.
     */
    async deleteEmployeeDailyTimeEntry(requestParameters: DeleteEmployeeDailyTimeEntryRequest): Promise<void> {
        await this.deleteEmployeeDailyTimeEntryRaw(requestParameters);
    }
    /**
     * Deletes Employee\'s Daily Time Entry.
     * Delete Employee\'s Daily Time Entry.
     */
    async deleteEmployeeDailyTimeEntryWithHeaders(requestParameters: DeleteEmployeeDailyTimeEntryRequest): Promise<Headers> {
        const response = await this.deleteEmployeeDailyTimeEntryRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds an employee\'s daily time entry by id.
     * Find an employee\'s daily time entry.
     */
    async findEmployeeDailyTimeEntryRaw(requestParameters: FindEmployeeDailyTimeEntryRequest): Promise<runtime.ApiResponse<DailyTimeEntry>> {
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling findEmployeeDailyTimeEntry.');
        }
        if (requestParameters.dailyTimeEntryId === null || requestParameters.dailyTimeEntryId === undefined) {
            throw new runtime.RequiredError('dailyTimeEntryId','Required parameter requestParameters.dailyTimeEntryId was null or undefined when calling findEmployeeDailyTimeEntry.');
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
            path: `/user-management/v1/employees/{employeeId}/dailyTimeEntries/{dailyTimeEntryId}`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))).replace(`{${"dailyTimeEntryId"}}`, encodeURIComponent(String(requestParameters.dailyTimeEntryId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => DailyTimeEntryFromJSON(jsonValue));
    }
    /**
     * Finds an employee\'s daily time entry by id.
     * Find an employee\'s daily time entry.
     */
    async findEmployeeDailyTimeEntry(requestParameters: FindEmployeeDailyTimeEntryRequest): Promise<DailyTimeEntry> {
        const response = await this.findEmployeeDailyTimeEntryRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds an employee\'s daily time entry by id.
     * Find an employee\'s daily time entry.
     */
    async findEmployeeDailyTimeEntryWithHeaders(requestParameters: FindEmployeeDailyTimeEntryRequest): Promise<[ DailyTimeEntry, Headers ]> {
        const response = await this.findEmployeeDailyTimeEntryRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Employees Daily Time Entries. There can be 0-1 daily time entries per work type per day.
     * List Employees Daily Time Entries.
     */
    async listEmployeeDailyTimeEntriesRaw(requestParameters: ListEmployeeDailyTimeEntriesRequest): Promise<runtime.ApiResponse<Array<DailyTimeEntry>>> {
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling listEmployeeDailyTimeEntries.');
        }
        const queryParameters: any = {};
        if (requestParameters.workEventType !== undefined) {
            queryParameters['workEventType'] = requestParameters.workEventType;
        }
        if (requestParameters.start !== undefined) {
            queryParameters['start'] = (requestParameters.start as any).toISOString().substr(0,10);
        }
        if (requestParameters.end !== undefined) {
            queryParameters['end'] = (requestParameters.end as any).toISOString().substr(0,10);
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
            path: `/user-management/v1/employees/{employeeId}/dailyTimeEntries`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DailyTimeEntryFromJSON));
    }
    /**
     * Lists Employees Daily Time Entries. There can be 0-1 daily time entries per work type per day.
     * List Employees Daily Time Entries.
     */
    async listEmployeeDailyTimeEntries(requestParameters: ListEmployeeDailyTimeEntriesRequest): Promise<Array<DailyTimeEntry>> {
        const response = await this.listEmployeeDailyTimeEntriesRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Employees Daily Time Entries. There can be 0-1 daily time entries per work type per day.
     * List Employees Daily Time Entries.
     */
    async listEmployeeDailyTimeEntriesWithHeaders(requestParameters: ListEmployeeDailyTimeEntriesRequest): Promise<[ Array<DailyTimeEntry>, Headers ]> {
        const response = await this.listEmployeeDailyTimeEntriesRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates Employee\'s Daily Time Entry.  Trying to update other than total hours from an entry should fail, as that could potentially clash with another entry. Instead, incorrect entry should be deleted and new one created. 
     * Update Employee\'s Daily Time Entry.
     */
    async updateEmployeeDailyTimeEntryRaw(requestParameters: UpdateEmployeeDailyTimeEntryRequest): Promise<runtime.ApiResponse<DailyTimeEntry>> {
        if (requestParameters.dailyTimeEntry === null || requestParameters.dailyTimeEntry === undefined) {
            throw new runtime.RequiredError('dailyTimeEntry','Required parameter requestParameters.dailyTimeEntry was null or undefined when calling updateEmployeeDailyTimeEntry.');
        }
        if (requestParameters.employeeId === null || requestParameters.employeeId === undefined) {
            throw new runtime.RequiredError('employeeId','Required parameter requestParameters.employeeId was null or undefined when calling updateEmployeeDailyTimeEntry.');
        }
        if (requestParameters.dailyTimeEntryId === null || requestParameters.dailyTimeEntryId === undefined) {
            throw new runtime.RequiredError('dailyTimeEntryId','Required parameter requestParameters.dailyTimeEntryId was null or undefined when calling updateEmployeeDailyTimeEntry.');
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
            path: `/user-management/v1/employees/{employeeId}/dailyTimeEntries/{dailyTimeEntryId}`.replace(`{${"employeeId"}}`, encodeURIComponent(String(requestParameters.employeeId))).replace(`{${"dailyTimeEntryId"}}`, encodeURIComponent(String(requestParameters.dailyTimeEntryId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: DailyTimeEntryToJSON(requestParameters.dailyTimeEntry),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => DailyTimeEntryFromJSON(jsonValue));
    }
    /**
     * Updates Employee\'s Daily Time Entry.  Trying to update other than total hours from an entry should fail, as that could potentially clash with another entry. Instead, incorrect entry should be deleted and new one created. 
     * Update Employee\'s Daily Time Entry.
     */
    async updateEmployeeDailyTimeEntry(requestParameters: UpdateEmployeeDailyTimeEntryRequest): Promise<DailyTimeEntry> {
        const response = await this.updateEmployeeDailyTimeEntryRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates Employee\'s Daily Time Entry.  Trying to update other than total hours from an entry should fail, as that could potentially clash with another entry. Instead, incorrect entry should be deleted and new one created. 
     * Update Employee\'s Daily Time Entry.
     */
    async updateEmployeeDailyTimeEntryWithHeaders(requestParameters: UpdateEmployeeDailyTimeEntryRequest): Promise<[ DailyTimeEntry, Headers ]> {
        const response = await this.updateEmployeeDailyTimeEntryRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
