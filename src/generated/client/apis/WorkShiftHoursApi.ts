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
    WorkShiftHours,
    WorkShiftHoursFromJSON,
    WorkShiftHoursToJSON,
    WorkType,
    WorkTypeFromJSON,
    WorkTypeToJSON,
} from '../models';
import { DateTime } from "luxon";
export interface DeleteWorkShiftHoursRequest {
    workShiftHoursId: string;
}
export interface FindWorkShiftHoursRequest {
    workShiftHoursId: string;
}
export interface ListWorkShiftHoursRequest {
    employeeId?: string;
    employeeWorkShiftId?: string;
    workType?: WorkType;
    employeeWorkShiftStartedAfter?: Date;
    employeeWorkShiftStartedBefore?: Date;
}
export interface UpdateWorkShiftHoursRequest {
    workShiftHours: WorkShiftHours;
    workShiftHoursId: string;
    workShiftChangeSetId: string;
}
/**
 * 
 */
export class WorkShiftHoursApi extends runtime.BaseAPI {
    /**
     * Only for tests.
     * Delete work shift hours.
     */
    async deleteWorkShiftHoursRaw(requestParameters: DeleteWorkShiftHoursRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.workShiftHoursId === null || requestParameters.workShiftHoursId === undefined) {
            throw new runtime.RequiredError('workShiftHoursId','Required parameter requestParameters.workShiftHoursId was null or undefined when calling deleteWorkShiftHours.');
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
            path: `/user-management/v1/workShiftHours/{workShiftHoursId}`.replace(`{${"workShiftHoursId"}}`, encodeURIComponent(String(requestParameters.workShiftHoursId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Only for tests.
     * Delete work shift hours.
     */
    async deleteWorkShiftHours(requestParameters: DeleteWorkShiftHoursRequest): Promise<void> {
        await this.deleteWorkShiftHoursRaw(requestParameters);
    }
    /**
     * Only for tests.
     * Delete work shift hours.
     */
    async deleteWorkShiftHoursWithHeaders(requestParameters: DeleteWorkShiftHoursRequest): Promise<Headers> {
        const response = await this.deleteWorkShiftHoursRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds Work Shift Hours.
     * Find Work Shift Hours.
     */
    async findWorkShiftHoursRaw(requestParameters: FindWorkShiftHoursRequest): Promise<runtime.ApiResponse<WorkShiftHours>> {
        if (requestParameters.workShiftHoursId === null || requestParameters.workShiftHoursId === undefined) {
            throw new runtime.RequiredError('workShiftHoursId','Required parameter requestParameters.workShiftHoursId was null or undefined when calling findWorkShiftHours.');
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
            path: `/user-management/v1/workShiftHours/{workShiftHoursId}`.replace(`{${"workShiftHoursId"}}`, encodeURIComponent(String(requestParameters.workShiftHoursId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => WorkShiftHoursFromJSON(jsonValue));
    }
    /**
     * Finds Work Shift Hours.
     * Find Work Shift Hours.
     */
    async findWorkShiftHours(requestParameters: FindWorkShiftHoursRequest): Promise<WorkShiftHours> {
        const response = await this.findWorkShiftHoursRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds Work Shift Hours.
     * Find Work Shift Hours.
     */
    async findWorkShiftHoursWithHeaders(requestParameters: FindWorkShiftHoursRequest): Promise<[ WorkShiftHours, Headers ]> {
        const response = await this.findWorkShiftHoursRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Work Shift Hours. Unique per employee per work shift per work type.
     * List Work Shift Hours.
     */
    async listWorkShiftHoursRaw(requestParameters: ListWorkShiftHoursRequest): Promise<runtime.ApiResponse<Array<WorkShiftHours>>> {
        const queryParameters: any = {};
        if (requestParameters.employeeId !== undefined) {
            queryParameters['employeeId'] = requestParameters.employeeId;
        }
        if (requestParameters.employeeWorkShiftId !== undefined) {
            queryParameters['employeeWorkShiftId'] = requestParameters.employeeWorkShiftId;
        }
        if (requestParameters.workType !== undefined) {
            queryParameters['workType'] = requestParameters.workType;
        }
        if (requestParameters.employeeWorkShiftStartedAfter !== undefined) {
            queryParameters['employeeWorkShiftStartedAfter'] = DateTime.fromJSDate(requestParameters.employeeWorkShiftStartedAfter as any).toISO();
        }
        if (requestParameters.employeeWorkShiftStartedBefore !== undefined) {
            queryParameters['employeeWorkShiftStartedBefore'] = DateTime.fromJSDate(requestParameters.employeeWorkShiftStartedBefore as any).toISO();
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
            path: `/user-management/v1/workShiftHours`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(WorkShiftHoursFromJSON));
    }
    /**
     * Lists Work Shift Hours. Unique per employee per work shift per work type.
     * List Work Shift Hours.
     */
    async listWorkShiftHours(requestParameters: ListWorkShiftHoursRequest = {}): Promise<Array<WorkShiftHours>> {
        const response = await this.listWorkShiftHoursRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Work Shift Hours. Unique per employee per work shift per work type.
     * List Work Shift Hours.
     */
    async listWorkShiftHoursWithHeaders(requestParameters: ListWorkShiftHoursRequest): Promise<[ Array<WorkShiftHours>, Headers ]> {
        const response = await this.listWorkShiftHoursRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates Work Shift Hours.  Trying to update employeeId, employeeWorkShiftId, or workType from work shift hours should fail. If the related employee work shift is approved, work shift hours cannot be updated. 
     * Update Work Shift Hours.
     */
    async updateWorkShiftHoursRaw(requestParameters: UpdateWorkShiftHoursRequest): Promise<runtime.ApiResponse<WorkShiftHours>> {
        if (requestParameters.workShiftHours === null || requestParameters.workShiftHours === undefined) {
            throw new runtime.RequiredError('workShiftHours','Required parameter requestParameters.workShiftHours was null or undefined when calling updateWorkShiftHours.');
        }
        if (requestParameters.workShiftHoursId === null || requestParameters.workShiftHoursId === undefined) {
            throw new runtime.RequiredError('workShiftHoursId','Required parameter requestParameters.workShiftHoursId was null or undefined when calling updateWorkShiftHours.');
        }
        if (requestParameters.workShiftChangeSetId === null || requestParameters.workShiftChangeSetId === undefined) {
            throw new runtime.RequiredError('workShiftChangeSetId','Required parameter requestParameters.workShiftChangeSetId was null or undefined when calling updateWorkShiftHours.');
        }
        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};
        headerParameters['Content-Type'] = 'application/json';
        if (requestParameters.workShiftChangeSetId !== undefined && requestParameters.workShiftChangeSetId !== null) {
            headerParameters['WorkShiftChangeSetId'] = String(requestParameters.workShiftChangeSetId);
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", ["manager"]);
            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user-management/v1/workShiftHours/{workShiftHoursId}`.replace(`{${"workShiftHoursId"}}`, encodeURIComponent(String(requestParameters.workShiftHoursId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: WorkShiftHoursToJSON(requestParameters.workShiftHours),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => WorkShiftHoursFromJSON(jsonValue));
    }
    /**
     * Updates Work Shift Hours.  Trying to update employeeId, employeeWorkShiftId, or workType from work shift hours should fail. If the related employee work shift is approved, work shift hours cannot be updated. 
     * Update Work Shift Hours.
     */
    async updateWorkShiftHours(requestParameters: UpdateWorkShiftHoursRequest): Promise<WorkShiftHours> {
        const response = await this.updateWorkShiftHoursRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates Work Shift Hours.  Trying to update employeeId, employeeWorkShiftId, or workType from work shift hours should fail. If the related employee work shift is approved, work shift hours cannot be updated. 
     * Update Work Shift Hours.
     */
    async updateWorkShiftHoursWithHeaders(requestParameters: UpdateWorkShiftHoursRequest): Promise<[ WorkShiftHours, Headers ]> {
        const response = await this.updateWorkShiftHoursRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
