/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Maybe = require('../core/Maybe')
const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')
const isArray = require('../core/isArray')
const safe = require('../core/safe')

const lift =
  safe(isDefined)

// propPath : [ String | Number ] -> a -> Maybe b
function propPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPath: Array of strings or integers required for first argument')
  }

  return keys.reduce((maybe, key) => {
    if(!(isString(key) || isInteger(key))) {
      throw new TypeError('propPath: Array of strings or integers required for first argument')
    }
    return maybe.chain(x => lift(x[key]))
  }, Maybe.of(target))
}

module.exports = curry(propPath)
