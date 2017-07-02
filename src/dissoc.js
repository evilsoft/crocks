/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isString = require('./core/isString')
const isObject  = require('./core/isObject')

function applyDissoc(key, obj) {
  return function(acc, k) {
    if(obj[k] !== undefined && k !== key) {
      acc[k] = obj[k]
    }
    return acc
  }
}

// dissoc : String -> Object -> Object
function dissoc(key, obj) {
  if(!isString(key)) {
    throw new TypeError('dissoc: String required for first argument')
  }

  if(!isObject(obj)) {
    throw new TypeError('dissoc: Object required for second argument')
  }

  return Object.keys(obj).reduce(applyDissoc(key, obj), {})
}

module.exports = curry(dissoc)
