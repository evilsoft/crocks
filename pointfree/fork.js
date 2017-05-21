/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Matt Ross (amsross) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')
const curry = require('../helpers/curry')
const Async = require('../crocks/Async')

function fork(reject, resolve, m) {
  if(!(isFunction(reject) && isFunction(resolve))) {
    throw new TypeError('fork: Reject and resolve functions required for first two arguments')
  }
  if(!(m && isSameType(Async, m))) {
    throw new TypeError('fork: Async required for third argument')
  }

  m.fork(reject, resolve)
}

module.exports = curry(fork)
