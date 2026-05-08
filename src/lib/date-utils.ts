/**
 * Subtract months from a date and return the resulting date.
 * @param date - The base date
 * @param months - Number of months to subtract
 * @returns A new Date object
 */
export function subMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

/**
 * Format a date to YYYY-MM-DD string format
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date string in YYYY-MM-DD format
 * @param dateStr - Date string to parse
 * @returns Parsed Date object
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}
