/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const isFunction = require('./isFunction')

function isIterable(iterable) {
  return iterable !== null && iterable !== undefined && isFunction(iterable[Symbol.iterator])
}

module.exports = isIterable
