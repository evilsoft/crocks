/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isObject = require('../predicates/isObject')
const isString = require('../predicates/isString')

const object = require('../internal/object')

// assoc : String -> a -> Object -> Object
function assoc(key, val, obj) {
  if(!isString(key)) {
    throw new TypeError('assoc: String required for first argument')
  }
  else if(!isObject(obj)) {
    throw new TypeError('assoc: Object required for third argument')
  }
  return object.assign({ [key]: val }, obj)
}

module.exports = curry(assoc)
