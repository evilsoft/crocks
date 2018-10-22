/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
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
        `${name}: Object required for third argument`
      )
    }

    throw new TypeError(
      `${name}: String required for first argument`
    )
  }

  return curry(setProp)
}

// setProp :: String -> a -> Object -> Object
const setProp =
  fn('setProp')

setProp.origFn =
  fn

module.exports = setProp
