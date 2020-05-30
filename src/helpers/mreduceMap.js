/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const isMonoid = require('../core/isMonoid')
const mconcatMap = require('../core/mconcatMap')

/** mreduceMap :: Monoid M => M -> (b -> a) -> ( [ b ] | List b ) -> a */
function mreduceMap(m, f, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mreduceMap: Monoid required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'mreduceMap: Function required for second argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mreduceMap: Foldable required for third argument'
    )
  }

  return mconcatMap(m, f, xs).valueOf()
}

module.exports = curry(mreduceMap)
