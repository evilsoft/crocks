/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isDefined = require('../core/isDefined')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

function fn(name) {
  function getPathOr(def, keys, target) {
    if(!isArray(keys)) {
      throw new TypeError(
        `${name}: Array of Non-empty Strings or Integers required for second argument`
      )
    }

    if(isNil(target)) {
      return def
    }

    let value = target
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
        throw new TypeError(
          `${name}: Array of Non-empty Strings or Integers required for second argument`
        )
      }

      if(isNil(value)) {
        return def
      }

      value = value[key]

      if(!isDefined(value)) {
        return def
      }
    }

    return value
  }

  return curry(getPathOr)
}

// getPathOr :: a -> [ String | Integer ] -> b -> c
const getPathOr =
  fn('getPathOr')

getPathOr.origFn =
  fn

module.exports =
  getPathOr
