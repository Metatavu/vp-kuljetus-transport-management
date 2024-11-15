import { DateTime } from "luxon";

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
}

export default DataValidation;
