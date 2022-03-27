function isDateObject(date: Date | string | number): boolean {
  return !!date && Object.prototype.toString.call(date) === '[object Date]'
}

export function serializeDate(date: Date | string | number): string {
  const originalDate = isDateObject(date) ? date : new Date(date);
  return (originalDate as Date).toISOString().split('T')[ 0 ];
}
