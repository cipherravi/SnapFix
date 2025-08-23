import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  parseISO,
  isValid
} from 'date-fns';

export function formatTime(dateString: string | Date | undefined | null ) {
 if (!dateString) return ''; // Or 'Invalid date'

  const parsedDate =
    typeof dateString === 'string' ? parseISO(dateString) : dateString;

  if (!isValid(parsedDate)) return ''; // Or 'Invalid date'

  if (isToday(parsedDate)) {
    return format(parsedDate, 'h:mm a'); // e.g., 12:20 AM
  }

  if (isYesterday(parsedDate)) {
    return 'Yesterday';
  }

  if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'EEEE'); // e.g., Wednesday
  }

  if (isThisYear(parsedDate)) {
    return format(parsedDate, 'dd/MM'); // e.g., 29/07
  }

  return format(parsedDate, 'dd/MM/yy'); // e.g., 29/07/25
}
