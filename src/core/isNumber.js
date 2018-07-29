/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isNumber : a -> Boolean
export default function isNumber(x) {
  return typeof x === 'number'
    && !isNaN(x)
}
