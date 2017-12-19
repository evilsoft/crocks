/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isNil= require('../core/isNil')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')
const { Nothing, Just } = require('../core/Maybe')

const lift = x =>
  !isNil(x) ? Just(x) : Nothing()

// prop : (String | Integer) -> a -> Maybe b
function prop(key, target) {
  if(!(isString(key) || isInteger(key))) {
    throw new TypeError('prop: String or integer required for first argument')
  }

  if(isNil(target)) {
    return Nothing()
  }

  return lift(target[key])
}

module.exports = curry(prop)
