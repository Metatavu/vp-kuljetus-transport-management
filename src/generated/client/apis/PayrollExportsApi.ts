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
    PayrollExport,
    PayrollExportFromJSON,
    PayrollExportToJSON,
} from '../models';

export interface CreatePayrollExportRequest {
    payrollExport: PayrollExport;
}

export interface FindPayrollExportRequest {
    payrollExportId: string;
}

export interface ListPayrollExportsRequest {
    employeeId?: string;
    exportedAfter?: Date;
    exportedBefore?: Date;
    first?: number;
    max?: number;
}

/**
 * 
 */
export class PayrollExportsApi extends runtime.BaseAPI {
    /**
     * Creates Payroll Export.  When payroll export is created, its ID is added to all included work shifts.  The payroll export can only be created if the work shifts included - are approved - are not included in another payroll export - are for the same employee as the payroll export 
     * Create Payroll Export.
     */
    async createPayrollExportRaw(requestParameters: CreatePayrollExportRequest): Promise<runtime.ApiResponse<PayrollExport>> {
        if (requestParameters.payrollExport === null || requestParameters.payrollExport === undefined) {
            throw new runtime.RequiredError('payrollExport','Required parameter requestParameters.payrollExport was null or undefined when calling createPayrollExport.');
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
            path: `/user-management/v1/payrollExports`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PayrollExportToJSON(requestParameters.payrollExport),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => PayrollExportFromJSON(jsonValue));
    }
    /**
     * Creates Payroll Export.  When payroll export is created, its ID is added to all included work shifts.  The payroll export can only be created if the work shifts included - are approved - are not included in another payroll export - are for the same employee as the payroll export 
     * Create Payroll Export.
     */
    async createPayrollExport(requestParameters: CreatePayrollExportRequest): Promise<PayrollExport> {
        const response = await this.createPayrollExportRaw(requestParameters);
        return await response.value();
    }
    /**
     * Creates Payroll Export.  When payroll export is created, its ID is added to all included work shifts.  The payroll export can only be created if the work shifts included - are approved - are not included in another payroll export - are for the same employee as the payroll export 
     * Create Payroll Export.
     */
    async createPayrollExportWithHeaders(requestParameters: CreatePayrollExportRequest): Promise<[ PayrollExport, Headers ]> {
        const response = await this.createPayrollExportRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Finds Payroll Export by ID.
     * Find Payroll Export.
     */
    async findPayrollExportRaw(requestParameters: FindPayrollExportRequest): Promise<runtime.ApiResponse<PayrollExport>> {
        if (requestParameters.payrollExportId === null || requestParameters.payrollExportId === undefined) {
            throw new runtime.RequiredError('payrollExportId','Required parameter requestParameters.payrollExportId was null or undefined when calling findPayrollExport.');
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
            path: `/user-management/v1/payrollExports/{payrollExportId}`.replace(`{${"payrollExportId"}}`, encodeURIComponent(String(requestParameters.payrollExportId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => PayrollExportFromJSON(jsonValue));
    }
    /**
     * Finds Payroll Export by ID.
     * Find Payroll Export.
     */
    async findPayrollExport(requestParameters: FindPayrollExportRequest): Promise<PayrollExport> {
        const response = await this.findPayrollExportRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds Payroll Export by ID.
     * Find Payroll Export.
     */
    async findPayrollExportWithHeaders(requestParameters: FindPayrollExportRequest): Promise<[ PayrollExport, Headers ]> {
        const response = await this.findPayrollExportRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists payroll exports.
     * List Payroll Exports.
     */
    async listPayrollExportsRaw(requestParameters: ListPayrollExportsRequest): Promise<runtime.ApiResponse<Array<PayrollExport>>> {
        const queryParameters: any = {};
        if (requestParameters.employeeId !== undefined) {
            queryParameters['employeeId'] = requestParameters.employeeId;
        }
        if (requestParameters.exportedAfter !== undefined) {
            queryParameters['exportedAfter'] = (requestParameters.exportedAfter as any).toISOString();
        }
        if (requestParameters.exportedBefore !== undefined) {
            queryParameters['exportedBefore'] = (requestParameters.exportedBefore as any).toISOString();
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
            path: `/user-management/v1/payrollExports`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PayrollExportFromJSON));
    }
    /**
     * Lists payroll exports.
     * List Payroll Exports.
     */
    async listPayrollExports(requestParameters: ListPayrollExportsRequest = {}): Promise<Array<PayrollExport>> {
        const response = await this.listPayrollExportsRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists payroll exports.
     * List Payroll Exports.
     */
    async listPayrollExportsWithHeaders(requestParameters: ListPayrollExportsRequest): Promise<[ Array<PayrollExport>, Headers ]> {
        const response = await this.listPayrollExportsRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}
