// utils/inputSanitizers.ts

/**
 * Ensures only digits are allowed, no leading 0, and within max range
 * @param value Input string from user
 * @returns Sanitized value or empty string if invalid
 */

export function sanitizeBudgetInput(value: string): string {
  // Allow empty (user deleting input)
  if (value === "") return "";

  if (!/^\d*$/.test(value)) return ""; // Only digits allowed

  // Disallow numbers starting with 0 but allow just "0"
  if (value.length >= 1 && value.startsWith("0")) return "";

  const numeric = parseInt(value, 10);
  if (!isNaN(numeric) && numeric > 9999) return ""; // max value (optional)

  return value;
}
