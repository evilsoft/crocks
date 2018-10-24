/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis */

const isSameType = require('../core/isSameType')

const Async = require('../core/types').proxy('Async')

// Async e a -> Promise a e
function asyncToPromise(m) {
  if(!isSameType(Async, m)) {
    throw new TypeError('asyncToPromise: Async required')
  }

  return m.toPromise()
}

module.exports = asyncToPromise
