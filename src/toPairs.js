/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isObject = require('./core/isObject')

const List = require('./core/List')
const Pair = require('./core/Pair')

// toPairs : Object -> List (Pair String a)
function toPairs(obj) {
  if(!isObject(obj)) {
    throw new TypeError('toPairs: Object required for argument')
  }

  return Object.keys(obj).reduce(
    (acc, key) => obj[key] !== undefined
      ? acc.concat(List.of(Pair(key, obj[key])))
      : acc,
    List.empty()
  )
}

module.exports = toPairs
