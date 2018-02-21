/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const { Nothing, Just } = require('../core/Maybe')

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

// propPath : [ String | Integer ] -> a -> Maybe b
function propPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPath: Array of Non-empty Strings or Integers required for first argument')
  }

  if(isNil(target)) {
    return Nothing()
  }

  let value = target
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!((isString(key) && !isEmpty(key)) || isInteger(key))) {
      throw new TypeError('propPath: Array of Non-empty Strings or Integers required for first argument')
    }

    if(isNil(value)) {
      return Nothing()
    }

    value = value[key]

    if(!isDefined(value)) {
      return Nothing()
    }
  }

  return Just(value)
}

module.exports = curry(propPath)
