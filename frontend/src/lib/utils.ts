import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string for display in the workspace timezone.
 * Used for due dates, reminders, and other business date display.
 */
export function formatDateInTimezone(
  dateString: string,
  timezone: string = "UTC",
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: timezone }).format(date);
  } catch {
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
}
