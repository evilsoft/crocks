/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pair = require('../core/Pair')
const isObject = require('../core/isObject')
const isArray = require('../core/isArray')

// toPairs : Object -> List (Pair String a)
function toPairs(obj) {
  if(!isObject(obj) && !isArray(obj)) {
    throw new TypeError('toPairs: Object or Array required for argument')
  }

  return Object.entries(obj).reduce(
    (acc, [key, value]) => value !== undefined
      ? acc.concat( [ Pair(key, value) ] )
      : acc,
    []
  )
}

module.exports = toPairs
