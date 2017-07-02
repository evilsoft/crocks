/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')

const identity = require('./core/identity')
const isFoldable = require('./core/isFoldable')
const isMonoid = require('./core/isMonoid')
const mconcatMap = require('./core/mconcatMap')

// mconcat : Monoid m => m -> ([ a ] | List a) -> m a
function mconcat(M, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mconcat: Monoid required for first argument')
  }

  if(!(isFoldable(xs))) {
    throw new TypeError('mconcat: Foldable required for second argument')
  }

  return mconcatMap(M, identity, xs)
}

module.exports = curry(mconcat)
