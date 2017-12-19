/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Maybe = require('../core/Maybe')
const { Nothing, Just } = Maybe

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isInteger = require('../core/isInteger')
const isNil= require('../core/isNil')
const isString = require('../core/isString')

const lift = x =>
  !isNil(x) ? Just(x) : Nothing()

// propPath : [ String | Integer ] -> a -> Maybe b
function propPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPath: Array of strings or integers required for first argument')
  }

  if(isNil(target)) {
    return Nothing()
  }
  return keys.reduce((maybe, key) => {
    if(!(isString(key) || isInteger(key))) {
      throw new TypeError('propPath: Array of strings or integers required for first argument')
    }
    return maybe.chain(x => lift(x[key]))
  }, Maybe.of(target))
}

module.exports = curry(propPath)
