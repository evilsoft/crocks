/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isNil = require('../core/isNil')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')
const { Nothing, Just } = require('../core/Maybe')

function fn(name) {
  function getProp(key, target) {
    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(`${name}: Non-empty String or Integer required for first argument`)
    }

    if(isNil(target)) {
      return Nothing()
    }

    const value = target[key]

    return isDefined(value)
      ? Just(value)
      : Nothing()
  }

  return curry(getProp)
}

const getProp =
  fn('getProp')

getProp.origFn =
  fn

module.exports = getProp
