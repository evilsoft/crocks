/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const isFunction = require('./isFunction')
const isNil = require('./isNil')

/** isIterable :: a -> Boolean */
function isIterable(iterable) {
  return !isNil(iterable) && isFunction(iterable[Symbol.iterator])
}

module.exports = isIterable
