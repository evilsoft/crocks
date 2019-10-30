/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const toString = Object.prototype.toString

/** isObject :: a -> Boolean */
function isObject(x) {
  return !!x
    && toString.call(x) === '[object Object]'
}

module.exports = isObject
