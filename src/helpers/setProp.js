/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isInteger = require('../core/isInteger')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const array = require('../core/array')
const object = require('../core/object')

function fn(name) {
  function setProp(key, val, x) {
    if(isObject(x)) {
      if(isString(key)) {
        return object.set(key, val, x)
      }

      throw new TypeError(
        `${name}: String required for first argument when third argument is an Object`
      )
    }

    if(isArray(x)) {
      if(isInteger(key) && key >= 0) {
        return array.set(key, val, x)
      }

      throw new TypeError(
        `${name}: Positive Integer required for first argument when third argument is an Array`
      )
    }

    throw new TypeError(
      `${name}: Object or Array required for third argument`
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
