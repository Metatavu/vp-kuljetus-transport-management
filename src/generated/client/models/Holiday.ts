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

import { exists, mapValues } from '../runtime';
import type { CompensationType } from './CompensationType';
import {
    CompensationTypeFromJSON,
    CompensationTypeFromJSONTyped,
    CompensationTypeToJSON,
} from './CompensationType';

/**
 * Represents a single holiday
 * @export
 * @interface Holiday
 */
export interface Holiday {
    /**
     * 
     * @type {string}
     * @memberof Holiday
     */
    readonly id?: string;
    /**
     * Holiday date
     * @type {Date}
     * @memberof Holiday
     */
    date: Date;
    /**
     * Holiday name
     * @type {string}
     * @memberof Holiday
     */
    name: string;
    /**
     * 
     * @type {CompensationType}
     * @memberof Holiday
     */
    compensationType: CompensationType;
    /**
     * Creator's ID
     * @type {string}
     * @memberof Holiday
     */
    creatorId?: string;
    /**
     * Last modifier's ID
     * @type {string}
     * @memberof Holiday
     */
    lastModifierId?: string;
    /**
     * Creation time
     * @type {Date}
     * @memberof Holiday
     */
    createdAt?: Date;
    /**
     * Last modified time
     * @type {Date}
     * @memberof Holiday
     */
    modifiedAt?: Date;
}

/**
 * Check if a given object implements the Holiday interface.
 */
export function instanceOfHoliday(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "date" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "compensationType" in value;

    return isInstance;
}

export function HolidayFromJSON(json: any): Holiday {
    return HolidayFromJSONTyped(json, false);
}

export function HolidayFromJSONTyped(json: any, ignoreDiscriminator: boolean): Holiday {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'date': (new Date(json['date'])),
        'name': json['name'],
        'compensationType': CompensationTypeFromJSON(json['compensationType']),
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'lastModifierId': !exists(json, 'lastModifierId') ? undefined : json['lastModifierId'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'modifiedAt': !exists(json, 'modifiedAt') ? undefined : (new Date(json['modifiedAt'])),
    };
}

export function HolidayToJSON(value?: Holiday | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'date': (value.date.toISOString().substring(0,10)),
        'name': value.name,
        'compensationType': CompensationTypeToJSON(value.compensationType),
        'creatorId': value.creatorId,
        'lastModifierId': value.lastModifierId,
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'modifiedAt': value.modifiedAt === undefined ? undefined : (value.modifiedAt.toISOString()),
    };
}

