/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isMonoid = require('../core/isMonoid')
const mconcatMap = require('../core/mconcatMap')

const identity = x => x

/** mreduce :: Monoid M => M -> ([ a ] | List a) -> a */
function mreduce(m, xs) {
  if(!isMonoid(m)) {
    throw new TypeError(
      'mreduce: Monoid required for first argument'
    )
  }

  if(!isFoldable(xs)) {
    throw new TypeError(
      'mreduce: Foldable required for second argument'
    )
  }

  return mconcatMap(m, identity, xs).valueOf()
}

module.exports = curry(mreduce)
