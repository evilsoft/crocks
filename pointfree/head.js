/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isArray = require('../internal/isArray')
const isString = require('../internal/isString')
const isFunction = require('../internal/isFunction')

const M = require('../crocks/Maybe')

function head(m) {
  if(isFunction(m.head)) {
    return m.head()
  }
  else if(isArray(m) || isString(m)) {
    return !m.length
      ? M.Nothing()
      : M.Just(m[0])
  }

  throw new TypeError('head: Array, String or List required')
}

module.exports = head

