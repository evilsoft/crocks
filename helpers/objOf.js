/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isString = require('../predicates/isString')

// objOf: String -> a -> Object
function objOf(key, value) {
  if(!(key && isString(key))) {
    throw new TypeError('objOf: Non-empty String required for first argument')
  }

  return { [key]: value }
}

module.exports = curry(objOf)
