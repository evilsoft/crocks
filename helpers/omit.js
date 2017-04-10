/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isFoldable = require('../predicates/isFoldable')
const isObject  = require('../predicates/isObject')

function omitKeys(keys, obj) {
  return function(acc, key) {
    return keys.indexOf(key) === -1 && obj[key] !== undefined
      ? Object.assign(acc, { [key]: obj[key] })
      : acc
  }
}

// omit : ([ String ] | List String) -> Object -> Object
function omit(keys, obj) {
  if(!isFoldable(keys)) {
    throw new TypeError('omit: Foldable required for first argument')
  }
  else if(!isObject(obj)) {
    throw new TypeError('omit: Object required for second argument')
  }

  return Object.keys(obj).reduce(omitKeys(keys, obj), {})
}

module.exports = curry(omit)
