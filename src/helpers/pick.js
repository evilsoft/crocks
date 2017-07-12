/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isObject  = require('../core/isObject')
const isString = require('../core/isString')

function pickKeys(obj) {
  return function(acc, key) {
    if(!isString(key)) {
      throw new TypeError('pick: Foldable of Strings is required for first argument')
    }
    return key && obj[key] !== undefined
      ? Object.assign(acc, { [key]: obj[key] })
      : acc
  }
}

// pick : ([ String ] | List String) -> Object -> Object
function pick(keys, obj) {
  if(!isFoldable(keys)) {
    throw new TypeError('pick: Foldable required for first argument')
  }
  else if(!isObject(obj)) {
    throw new TypeError('pick: Object required for second argument')
  }

  return keys.reduce(pickKeys(obj), {})
}

module.exports = curry(pick)
