/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isInteger = require('../core/isInteger')
const isObject = require('../core/isObject')
const isString = require('../core/isString')
const object = require('../core/object')

function fn(name) {
  function setProp(key, val, x) {
    if(isString(key)) {
      if(isObject(x)) {
        return object.set(key, val , x)
      }

      throw new TypeError(
        `${name}: Object required for third argument when first is a String`
      )
    }

    if(isInteger(key)) {
      if(isArray(x)) {
        return array.set(key, val, x)
      }

      throw new TypeError(
        `${name}: Array required for third argument when first is an Integer`
      )

    }

    throw new TypeError(
      `${name}: String or Integer required for first argument`
    )
  }

  return curry(setProp)
}

// setProp :: (String | Integer) -> a -> (Object | Array) -> (Object | Array)
const setProp =
  fn('setProp')

setProp.origFn =
  fn

module.exports = setProp
