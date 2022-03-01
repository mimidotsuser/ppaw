function isDateObject(date) {
  return date && Object.prototype.toString.call(date) === '[object Date]'
}

export function formatDate(date: any) {
  const originalDate: Date = isDateObject(date) ? date : new Date(date);
  return originalDate.toISOString().split('T')[ 0 ];
}
