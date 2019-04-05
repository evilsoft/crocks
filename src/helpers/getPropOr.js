/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isNil = require('../core/isNil')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')

function fn(name) {
  function getPropOr(def, key, target) {
    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(`${name}: Non-empty String or Integer required for second argument`)
    }

    if(isNil(target)) {
      return def
    }

    const value = target[key]

    return isDefined(value)
      ? value
      : def
  }

  return curry(getPropOr)
}

// getPropOr : a -> (String | Integer) -> b -> c
const getPropOr =
  fn('getPropOr')

getPropOr.origFn =
  fn

module.exports = getPropOr
