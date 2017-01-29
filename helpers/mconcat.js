/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')

const isFoldable = require('../predicates/isFoldable')
const isMonoid = require('../predicates/isMonoid')

const identity = require('../combinators/identity')

const mconcatMap = require('./mconcatMap')

// mconcat :: Monoid m => m -> ([ a ] | List a) -> m a
function mconcat(M, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mconcat: Monoid required for first argument')
  }
  else if(!(isFoldable(xs))) {
    throw new TypeError('mconcat: Foldable required for second argument')
  }

  return mconcatMap(M, identity, xs)
}

module.exports = curry(mconcat)
