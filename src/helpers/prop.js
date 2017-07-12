/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')
const safe = require('../core/safe')

const lift =
  safe(isDefined)

// prop : String | Number -> a -> Maybe b
function prop(key, target) {
  if(!(isString(key) || isInteger(key))) {
    throw new TypeError('prop: String or integer required for first argument')
  }

  return lift(target[key])
}

module.exports = curry(prop)
