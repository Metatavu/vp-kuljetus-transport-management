import { DateTime } from "luxon";

namespace TimeUtils {
  export const displayAsDateTime = (timestampInSeconds?: number, fallback?: string) => {
    if (timestampInSeconds === undefined) return fallback ?? "";
    return DateTime.fromSeconds(timestampInSeconds).toFormat("dd.MM.yyyy HH:mm:ss");
  }
}

export default TimeUtils;