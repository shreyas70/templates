import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatStr = 'MMM dd, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a time string to a human-readable format
 * @param timeString - Time string (e.g., '14:30:00')
 * @returns Formatted time string (e.g., '2:30 PM')
 */
export const formatTime = (timeString: string): string => {
  try {
    // If it's a full ISO date string, parse it and format just the time
    if (timeString.includes('T')) {
      return format(parseISO(timeString), 'h:mm a');
    }
    
    // If it's just a time string (HH:MM:SS), convert to 12-hour format
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Format a currency value
 * @param value - Number or string value
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string, currency = 'USD'): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '—';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numValue);
};

/**
 * Format a phone number to a standard format
 * @param phoneNumber - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the input is valid
  if (cleaned.length !== 10) {
    return phoneNumber;
  }
  
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Truncate a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length (default: 50)
 * @returns Truncated string
 */
export const truncateString = (str: string, length = 50): string => {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

/**
 * Format a name to title case
 * @param name - Name string
 * @returns Title-cased name
 */
export const formatName = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};
