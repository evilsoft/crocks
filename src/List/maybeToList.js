/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const List = require('.')
const Maybe = require('../core/types').proxy('Maybe')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const applyTransform = maybe =>
  maybe.either(
    List.empty,
    List.of
  )

const err =
  'maybeToList: Argument must be a Maybe instance or a Maybe returning function'

/** maybeToList :: Maybe a -> List a */
/** maybeToList :: (a -> Maybe b) -> a -> List b */
function maybeToList(maybe) {
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

module.exports = curry(maybeToList)

