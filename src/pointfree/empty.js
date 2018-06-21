/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('../core/hasAlg')
const isSameType = require('../core/isSameType')
const fl = require('../core/flNames')

function empty(m) {
  if(m && hasAlg('empty', m)) {
    return (m[fl.empty] || m.empty).call(m)
  }

  if(m && hasAlg('empty', m.constructor)) {
    return (m.constructor[fl.empty] || m.constructor.empty).call(m)
  }

  if(isSameType([], m)) {
    return []
  }

  if(isSameType('', m)) {
    return ''
  }

  if(isSameType({}, m)) {
    return {}
  }

  throw new TypeError('empty: Monoid, Array, String or Object required')
}

module.exports = empty
