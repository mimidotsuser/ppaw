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
