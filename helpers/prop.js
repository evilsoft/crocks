/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const safe = require('./safe')

const isDefined = require('../predicates/isDefined')
const isInteger = require('../predicates/isInteger')
const isString = require('../predicates/isString')

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
