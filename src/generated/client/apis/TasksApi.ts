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
    Task,
    TaskFromJSON,
    TaskToJSON,
    TaskType,
    TaskTypeFromJSON,
    TaskTypeToJSON,
} from '../models';

export interface CreateTaskRequest {
    task: Task;
}

export interface DeleteTaskRequest {
    taskId: string;
}

export interface FindTaskRequest {
    taskId: string;
}

export interface ListTasksRequest {
    routeId?: string;
    assignedToRoute?: boolean;
    freightId?: string;
    customerSiteId?: string;
    type?: TaskType;
    first?: number;
    max?: number;
}

export interface UpdateTaskRequest {
    task: Task;
    taskId: string;
}

/**
 * 
 */
export class TasksApi extends runtime.BaseAPI {
    /**
     * Create new task
     * Create task
     */
    async createTaskRaw(requestParameters: CreateTaskRequest): Promise<runtime.ApiResponse<Task>> {
        if (requestParameters.task === null || requestParameters.task === undefined) {
            throw new runtime.RequiredError('task','Required parameter requestParameters.task was null or undefined when calling createTask.');
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
            path: `/delivery-info/v1/tasks`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TaskToJSON(requestParameters.task),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TaskFromJSON(jsonValue));
    }
    /**
     * Create new task
     * Create task
     */
    async createTask(requestParameters: CreateTaskRequest): Promise<Task> {
        const response = await this.createTaskRaw(requestParameters);
        return await response.value();
    }
    /**
     * Create new task
     * Create task
     */
    async createTaskWithHeaders(requestParameters: CreateTaskRequest): Promise<[ Task, Headers ]> {
        const response = await this.createTaskRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Deletes task
     * Deletes task
     */
    async deleteTaskRaw(requestParameters: DeleteTaskRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.taskId === null || requestParameters.taskId === undefined) {
            throw new runtime.RequiredError('taskId','Required parameter requestParameters.taskId was null or undefined when calling deleteTask.');
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
            path: `/delivery-info/v1/tasks/{taskId}`.replace(`{${"taskId"}}`, encodeURIComponent(String(requestParameters.taskId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.VoidApiResponse(response);
    }
    /**
     * Deletes task
     * Deletes task
     */
    async deleteTask(requestParameters: DeleteTaskRequest): Promise<void> {
        await this.deleteTaskRaw(requestParameters);
    }
    /**
     * Deletes task
     * Deletes task
     */
    async deleteTaskWithHeaders(requestParameters: DeleteTaskRequest): Promise<Headers> {
        const response = await this.deleteTaskRaw(requestParameters);
        return response.raw.headers;
    }
    /**
     * Finds a task by id.
     * Find a task.
     */
    async findTaskRaw(requestParameters: FindTaskRequest): Promise<runtime.ApiResponse<Task>> {
        if (requestParameters.taskId === null || requestParameters.taskId === undefined) {
            throw new runtime.RequiredError('taskId','Required parameter requestParameters.taskId was null or undefined when calling findTask.');
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
            path: `/delivery-info/v1/tasks/{taskId}`.replace(`{${"taskId"}}`, encodeURIComponent(String(requestParameters.taskId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TaskFromJSON(jsonValue));
    }
    /**
     * Finds a task by id.
     * Find a task.
     */
    async findTask(requestParameters: FindTaskRequest): Promise<Task> {
        const response = await this.findTaskRaw(requestParameters);
        return await response.value();
    }
    /**
     * Finds a task by id.
     * Find a task.
     */
    async findTaskWithHeaders(requestParameters: FindTaskRequest): Promise<[ Task, Headers ]> {
        const response = await this.findTaskRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Lists Tasks.
     * List Tasks.
     */
    async listTasksRaw(requestParameters: ListTasksRequest): Promise<runtime.ApiResponse<Array<Task>>> {
        const queryParameters: any = {};
        if (requestParameters.routeId !== undefined) {
            queryParameters['routeId'] = requestParameters.routeId;
        }
        if (requestParameters.assignedToRoute !== undefined) {
            queryParameters['assignedToRoute'] = requestParameters.assignedToRoute;
        }
        if (requestParameters.freightId !== undefined) {
            queryParameters['freightId'] = requestParameters.freightId;
        }
        if (requestParameters.customerSiteId !== undefined) {
            queryParameters['customerSiteId'] = requestParameters.customerSiteId;
        }
        if (requestParameters.type !== undefined) {
            queryParameters['type'] = requestParameters.type;
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
            path: `/delivery-info/v1/tasks`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TaskFromJSON));
    }
    /**
     * Lists Tasks.
     * List Tasks.
     */
    async listTasks(requestParameters: ListTasksRequest = {}): Promise<Array<Task>> {
        const response = await this.listTasksRaw(requestParameters);
        return await response.value();
    }
    /**
     * Lists Tasks.
     * List Tasks.
     */
    async listTasksWithHeaders(requestParameters: ListTasksRequest): Promise<[ Array<Task>, Headers ]> {
        const response = await this.listTasksRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
    /**
     * Updates single task
     * Updates task
     */
    async updateTaskRaw(requestParameters: UpdateTaskRequest): Promise<runtime.ApiResponse<Task>> {
        if (requestParameters.task === null || requestParameters.task === undefined) {
            throw new runtime.RequiredError('task','Required parameter requestParameters.task was null or undefined when calling updateTask.');
        }
        if (requestParameters.taskId === null || requestParameters.taskId === undefined) {
            throw new runtime.RequiredError('taskId','Required parameter requestParameters.taskId was null or undefined when calling updateTask.');
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
            path: `/delivery-info/v1/tasks/{taskId}`.replace(`{${"taskId"}}`, encodeURIComponent(String(requestParameters.taskId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: TaskToJSON(requestParameters.task),
        });
        return new runtime.JSONApiResponse(response, (jsonValue) => TaskFromJSON(jsonValue));
    }
    /**
     * Updates single task
     * Updates task
     */
    async updateTask(requestParameters: UpdateTaskRequest): Promise<Task> {
        const response = await this.updateTaskRaw(requestParameters);
        return await response.value();
    }
    /**
     * Updates single task
     * Updates task
     */
    async updateTaskWithHeaders(requestParameters: UpdateTaskRequest): Promise<[ Task, Headers ]> {
        const response = await this.updateTaskRaw(requestParameters);
        const value = await response.value(); 
        return [ value, response.raw.headers ];
    }
}