export { default as merge } from 'lodash/merge';

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