/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

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
