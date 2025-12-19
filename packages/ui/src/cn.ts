export type ClassValue = string | number | boolean | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values
    .filter((value): value is string | number | boolean => value !== null && value !== undefined && value !== false)
    .map((value) => String(value))
    .join(' ')
    .trim();
}
