import { DateTime } from "luxon";

namespace TimeUtils {
  export const displayAsDateTime = (timestampInSeconds?: number, fallback?: string) => {
    if (timestampInSeconds === undefined) return fallback ?? "";
    return DateTime.fromSeconds(timestampInSeconds).toFormat("dd.MM.yyyy HH:mm:ss");
  }
  export const displayAsDate = (date?: Date) => {
    if (!date) return;

    return DateTime.fromJSDate(date).toFormat("dd.MM.yyyy");
  }
}

export default TimeUtils;