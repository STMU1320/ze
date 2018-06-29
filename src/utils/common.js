const PRECISION = 0.00001; // 常量，据的精度，小于这个精度认为是0

export { default as merge } from 'lodash/merge';
export { default as remove } from 'lodash/remove';
export { default as each } from 'lodash/forEach';
export { default as clone } from 'lodash/clone';
export { default as isNil } from 'lodash/isNil';
export { default as findLastIndex } from 'lodash/findLastIndex';

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