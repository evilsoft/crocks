/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

import isFunction from './isFunction'
import isNil from './isNil'

export default function isIterable(iterable) {
  return !isNil(iterable) && isFunction(iterable[Symbol.iterator])
}
