/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

// isPromise : a -> Boolean
function isPromise(p) {
  return !!p
    && isFunction(p.then)
    && isFunction(p.catch)
}

module.exports = isPromise
