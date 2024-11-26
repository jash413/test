// File: lib/date_utils.ts

export function formatTimestamp(timestamp: string): string {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Define default options
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  // Use a try-catch block to handle potential errors
  try {
    // Attempt to get the user's locale and timezone
    if (typeof window !== 'undefined') {
      options.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    const userLocale =
      typeof window !== 'undefined'
        ? window.navigator.language || 'en-US'
        : 'en-US';

    // Format the date using DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat(userLocale, options).format(
      date
    );

    // Replace the comma between date and time with a space
    return formattedDate.replace(',', '');
  } catch (error) {
    // Fallback to a basic format if an error occurs
    console.error('Error formatting date:', error);
    return date.toLocaleString('en-US', options);
  }
}
