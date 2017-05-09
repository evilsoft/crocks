/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isSameType = require('../predicates/isSameType')
const isFunction = require('../predicates/isFunction')

function empty(m) {
  if(m && isFunction(m.empty)) {
    return m.empty()
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
