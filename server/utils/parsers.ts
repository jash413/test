// @/server/utils/date_utils.ts

import { isEqual } from 'lodash';

export function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string') {
    // Remove any surrounding quotes
    const cleanValue = value.replace(/^["']|["']$/g, '');

    // Try parsing as ISO date string
    const date = new Date(cleanValue);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // Try parsing as a Unix timestamp (milliseconds)
    const timestamp = parseInt(cleanValue, 10);
    if (!isNaN(timestamp)) {
      const dateFromTimestamp = new Date(timestamp);
      if (!isNaN(dateFromTimestamp.getTime())) {
        return dateFromTimestamp;
      }
    }
  }
  return null;
}

export function parseDateArray(value: unknown): Date[] {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.map(parseDate).filter((d): d is Date => d !== null)
        : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) {
    return value.map(parseDate).filter((d): d is Date => d !== null);
  }
  return [];
}

export function formatDateForAPI(date: Date | null): string | null {
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toISOString()
    : null;
}

export function formatDateArrayForAPI(dates: Date[]): string[] {
  return dates.map(formatDateForAPI).filter((d): d is string => d !== null);
}

// @/server/utils/number_utils.ts

export function parseInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number =
    typeof value === 'string' ? parseInt(value, 10) : Number(value);

  return isNaN(number) ? null : Math.round(number);
}

export function parseBigInt(value: unknown): BigInt | null {
  if (value == null || value == undefined || value == '' || value == 'null') {
    return null;
  }

  const number =
    typeof value === 'string' ? BigInt(value) : BigInt(Number(value));

  return Number.isNaN(BigInt(number)) ? null : number;
}

export function parseFloat(
  value: unknown,
  decimalPlaces: number = 2
): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = typeof value === 'string' ? Number(value) : value;

  if (typeof number !== 'number' || isNaN(number)) {
    return null;
  }

  return Number(number.toFixed(decimalPlaces));
}

export function formatIntegerForAPI(value: unknown): string | null {
  const parsedValue = parseInteger(value);
  return parsedValue !== null ? parsedValue.toString() : null;
}

export function formatFloatForAPI(
  value: unknown,
  decimalPlaces: number = 2
): string | null {
  const parsedValue = parseFloat(value, decimalPlaces);
  return parsedValue !== null ? parsedValue.toFixed(decimalPlaces) : null;
}

export const areDatesEqual = (
  date1: string | Date | null | undefined,
  date2: string | Date | null | undefined
) => {
  if (date1 === date2) return true; // Handles null, undefined, and exact string matches
  if (!date1 || !date2) return false; // One is null/undefined, the other isn't

  const parseDate = (date: string | Date): Date => {
    if (typeof date === 'string') {
      // Remove any trailing 'Z' and milliseconds for consistency
      const cleanDate = date.replace(/\.000Z$/, 'Z').replace(/Z$/, '');
      return new Date(cleanDate);
    }
    return date;
  };

  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  // Compare year, month, day, hours, minutes, and seconds
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

export const isDateString = (value: any): boolean => {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
  );
};
import _ from 'lodash'; // Assuming you're using lodash for isEqual

export const areArraysEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const isDateArray = arr1.length > 0 && isDateString(arr1[0]);

  for (let i = 0; i < arr1.length; i++) {
    if (isDateArray) {
      if (!areDatesEqual(arr1[i], arr2[i])) return false;
    } else {
      // Custom comparison for objects
      if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object') {
        const keys1 = Object.keys(arr1[i]).sort();
        const keys2 = Object.keys(arr2[i]).sort();

        if (!_.isEqual(keys1, keys2)) return false;

        for (let key of keys1) {
          if (key !== 'model' && !_.isEqual(arr1[i][key], arr2[i][key])) {
            return false;
          }
        }
      } else {
        if (!_.isEqual(arr1[i], arr2[i])) return false;
      }
    }
  }
  return true;
};

export function parseArrayString(value: unknown): string[] {
  if (typeof value === 'string') {
    try {
      // First, try to parse it as JSON
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If parsing fails, split by comma and trim each item
      return value.split(',').map((item) => item.trim());
    }
  }
  return Array.isArray(value) ? value : [];
}

export function parseBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lowercaseValue = value.toLowerCase().trim();
    if (
      lowercaseValue === 'true' ||
      lowercaseValue === 'yes' ||
      lowercaseValue === '1'
    ) {
      return true;
    }
    if (
      lowercaseValue === 'false' ||
      lowercaseValue === 'no' ||
      lowercaseValue === '0'
    ) {
      return false;
    }
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (value === null || value === undefined) {
    return null;
  }

  return null; // For any other type, return null
}
