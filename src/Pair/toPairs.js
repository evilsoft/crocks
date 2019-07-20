/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pair = require('../core/Pair')
const isObject = require('../core/isObject')

// toPairs : Object -> Array (Pair String a)
function toPairs(obj) {
  if(!isObject(obj)) {
    throw new TypeError('toPairs: Object required for argument')
  }

  return Object.keys(obj).reduce(
    (acc, key) => obj[key] !== undefined
      ? acc.concat([ Pair(key, obj[key]) ])
      : acc,
    []
  )
}

module.exports = toPairs
