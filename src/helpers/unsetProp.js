/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isEmpty = require('../core/isEmpty')
const isInteger  = require('../core/isInteger')
const isObject  = require('../core/isObject')
const isString = require('../core/isString')

const array = require('../core/array')
const object = require('../core/object')

function fn(name) {
  function unsetProp(key, obj) {
    if(!(isObject(obj) || isArray(obj))) {
      return obj
    }

    if(!(isString(key) && !isEmpty(key) || isInteger(key) && key >= 0)) {
      throw new TypeError(
        `${name}: Non-empty String required or Positive Integer required for first argument`
      )
    }

    if(isObject(obj)) {
      if(isString(key) && !isEmpty(key)) {
        return object.unset(key, obj)
      }
    }

    if(isArray(obj)) {
      if(isInteger(key) && key >= 0) {
        return array.unset(key, obj)
      }
    }

    return obj
  }

  return curry(unsetProp)
}

const unsetProp =
  fn('unsetProp')

unsetProp.origFn =
  fn

module.exports =
  unsetProp
