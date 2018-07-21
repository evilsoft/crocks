/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis */

const isFunction = require('../core/isFunction')

function toPromise(m) {
  if(!(m && isFunction(m.toPromise))) {
    throw new TypeError('toPromise: Async required')
  }

  return m.toPromise()
}

module.exports = toPromise
