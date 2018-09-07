const PRECISION = 0.00001; // 常量，据的精度，小于这个精度认为是0

export { default as merge } from 'lodash/merge';
export { default as remove } from 'lodash/remove';
export { default as each } from 'lodash/forEach';
export { default as clone } from 'lodash/clone';
export { default as cloneDeep } from 'lodash/cloneDeep';
export { default as isNil } from 'lodash/isNil';
export { default as debounce } from 'lodash/debounce';
export { default as throttle } from 'lodash/throttle';
export { default as findLastIndex } from 'lodash/findLastIndex';
export { default as differenceBy } from 'lodash/differenceBy';

export function upperFirst (string) {
  if (isEmpty(string)) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isEmpty (value) {
  if (value == null || value === '') {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false; 
}

export function isNumberEqual(a, b) {
  return Math.abs((a - b)) < PRECISION;
}

export function mod(n, m) {
  return ((n % m) + m) % m;
}

export function clamp(a, min, max) {
  if (a < min) {
    return min;
  } else if (a > max) {
    return max;
  }
  return a;
}

export function assign (target, ...source) {
  if (source.length === 0) {
    return target;
  }
  for ( let i = 0; i < source.length; i++ ) {
    const si = source[i];
    // console.log(si);
    if (si == null || typeof si !== 'object') {
      continue;
    }
    Object.keys(si).forEach(key => {
      const value = si[key];
      if (typeof value === 'object' && !Array.isArray(value)) {
        target[key] = Object.assign ({}, target[key], value);
      } else {
        target[key] = value;
      }
    });
  }
  return target;
}

export function translateToPi (angle) {
  return angle / 180 * Math.PI;
}