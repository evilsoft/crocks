/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _mconcatMap = require('../core/mconcatMap')
const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const isMonoid = require('../core/isMonoid')

/** mconcatMap :: Monoid M => M -> (b -> a) -> ([ b ] | List b) -> M a */
function mconcatMap(m, f, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mconcatMap: Monoid required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'mconcatMap: Function required for second argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mconcatMap: Foldable required for third argument'
    )
  }

  return _mconcatMap(m, f, xs)
}

module.exports = curry(mconcatMap)
