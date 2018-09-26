/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis */

const isSameType = require('../core/isSameType')

const Async = require('../core/types').proxy('Async')

function toPromise(m) {
  if(!isSameType(Async, m)) {
    throw new TypeError('toPromise: Async required')
  }

  return m.toPromise()
}

module.exports = toPromise
