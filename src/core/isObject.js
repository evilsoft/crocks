/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isObject : a -> Boolean
function isObject(x) {
  return !!x
    && x.toString
    && x.toString() === '[object Object]'
}

module.exports = isObject
