import { type Towable, type Truck, TruckTypeEnum } from "generated/client";
import { t } from "i18next";
import { DateTime } from "luxon";
import z from "zod/v4";

namespace DataValidation {
  export const validateValueIsNotUndefinedNorNull = <T>(value: null | undefined | T): value is T => {
    return value !== null && value !== undefined;
  };

  export const parseValidDateTime = (date: Date | string | null | undefined) => {
    if (date === null || date === undefined) throw Error("Empty date");

    let dateTime: DateTime<true> | DateTime<false> = DateTime.invalid("Invalid date format");

    if (date instanceof Date) dateTime = DateTime.fromJSDate(date);
    if (typeof date === "string") dateTime = DateTime.fromISO(date);

    if (!dateTime.isValid) {
      console.error("Invalid date format", date);
      throw Error("Invalid date format");
    }

    return dateTime;
  };

  /**
   * Check if a given object implements the Truck interface
   *
   * @param truckOrTowable truck or towable object
   * @returns
   */
  export const isTruck = (truckOrTowable: Truck | Towable): truckOrTowable is Truck => {
    return Object.values(TruckTypeEnum).includes(truckOrTowable.type as TruckTypeEnum);
  };

  /**
   * Check if a given string is a valid postal code length
   *
   * @param string postal code
   * @returns Error string or boolean when valid
   */
  export const validatePostalCode = (value: string) => {
    if (value.length !== 5) {
      return t("management.terminals.errorMessages.postalCodeTooShort");
    }
    if (!/^\d+$/.test(value)) {
      return t("management.terminals.errorMessages.postalCodeInvalidFormat");
    }
    return true;
  };

  export const validDatetimeTransform = z.transform<string | undefined, DateTime<true> | undefined>(
    (value, context) => {
      if (!value) return undefined;

      const datetime = DateTime.fromISO(value);

      if (!datetime.isValid) {
        context.issues.push({
          code: "invalid_format",
          format: "datetime",
          input: value,
        });
        return z.NEVER;
      }

      return datetime;
    },
  );
}

export default DataValidation;
