/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isInteger = require('../core/isInteger')
const isNil= require('../core/isNil')
const isString = require('../core/isString')
const equals = require('../core/equals')
const Maybe = require('../core/Maybe')

const { Just, Nothing } = Maybe

const lift = x => (!isNil(x) ? Just(x) : Nothing())

// propPathEq :: [ String | Number ] -> a -> Object -> Boolean
function propPathEq(path, key, target) {
  if (!isArray(path)) {
    throw new TypeError(
      'propPathEq: Array of strings or integers required for first argument'
    )
  }
  const result = path.reduce((maybe, key) => {
    if (!(isString(key) || isInteger(key))) {
      throw new TypeError(
        'propPathEq: Array of strings or integers required for first argument'
      )
    }
    return maybe.chain(x => lift(x[key]))
  }, Maybe.of(target))

  return equals(result, key)
}

module.exports = curry(propPathEq)
