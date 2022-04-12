export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) { return true;}

  //NaN === NaN
  if (typeof obj1 === 'number' && typeof obj2 === 'number' && isNaN(obj1) && isNaN(obj2)) {
    return true;
  }

  //if one is not object compare to the other
  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {return false}

  if (obj1.constructor !== obj2.constructor) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (typeof obj1[ key ]) {
      return shallowEqual(obj1[ key ], obj2[ key ])
    }
    if (obj1[ key ] !== obj2[ key ]) {
      return false;
    }
  }

  return true;
}

export function addDaysToDate(start: any, days: number, excludeWeekends = false): Date {
  const prev = new Date(start.getTime());
  if (!excludeWeekends) {
    prev.setDate(prev.getDate() + days);
    return prev;
  } else {
    let isWeekend = false;
    while (days) {
      prev.setDate(prev.getDate() + 1);
      isWeekend = prev.getDay() === 0 || prev.getDay() === 6;
      if (!isWeekend) {
        days--;
      }
    }
    return prev;
  }
}


export function extractFilenameFromHeader(header?: string | null, defaultFilename = 'default-file') {
  if (header && header.includes('filename')) {
    const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(header)
    if (match && match[ 1 ]) {
      defaultFilename = match[ 1 ].replace(/"/g, '')
    }
  }
  return defaultFilename;
}
