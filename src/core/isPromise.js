/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from './isFunction.js'

// isPromise : a -> Boolean
function isPromise(p) {
  return !!p
    && isFunction(p.then)
    && isFunction(p.catch)
}

export default isPromise
