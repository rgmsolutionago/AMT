/**
 * Helper function to fix irregularities in SOAP WS responses
 */
export function forceToArray<T>(value: T | T[]): T[] {
    return !Array.isArray(value) ? [value] : value;
}