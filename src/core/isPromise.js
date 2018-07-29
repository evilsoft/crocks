/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from './isFunction'

// isPromise : a -> Boolean
export default function isPromise(p) {
  return !!p
    && isFunction(p.then)
    && isFunction(p.catch)
}
