/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isNil = require('../core/isNil')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')
const { Nothing, Just } = require('../core/Maybe')

// prop : (String | Integer) -> a -> Maybe b
function prop(key, target) {
  if(!((isString(key) && !isEmpty(key)) || isInteger(key))) {
    throw new TypeError('prop: Non-empty String or Integer required for first argument')
  }

  if(isNil(target)) {
    return Nothing()
  }

  const value = target[key]

  return isDefined(value)
    ? Just(value)
    : Nothing()
}

module.exports = curry(prop)
