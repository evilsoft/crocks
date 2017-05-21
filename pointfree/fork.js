/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Matt Ross (amsross) */

const isFunction = require('../predicates/isFunction')
const curry = require('../helpers/curry')

function fork(reject, resolve, m) {
  if(!isFunction(reject) || !isFunction(resolve)) {
    throw new TypeError('fork: Reject and resolve functions required')
  }
  else if(!(m && isFunction(m.fork))) {
    throw new TypeError('fork: Async required')
  }

  m.fork(reject, resolve)
}

module.exports = curry(fork)
