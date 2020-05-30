/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Maybe = require('.')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = maybe =>
  maybe.either(() => [], x => [ x ])

const err =
  'maybeToArray: Argument must be a Maybe instanstace or a Maybe returning function'

function maybeToArray(maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError(err)
      }
      return applyTransform(m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(maybe)
  }

  throw new TypeError(err)
}

module.exports = curry(maybeToArray)
