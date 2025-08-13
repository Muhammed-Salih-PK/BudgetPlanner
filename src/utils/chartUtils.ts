import { ChartDatesType } from "@/types/transaction";

/**
 * Calculates the cutoff date based on the selected time range
 */
export const getCutoffDate = (range: ChartDatesType): Date => {
  const now = new Date();
  const date = new Date(now);

  switch (range) {
    case "week":
      date.setDate(date.getDate() - 7);
      break;
    case "month":
      date.setMonth(date.getMonth() - 1);
      break;
    case "year":
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      // Handle unexpected values
      date.setMonth(date.getMonth() - 1);
  }

  return date;
};
