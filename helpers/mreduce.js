/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')

const isFoldable = require('../predicates/isFoldable')
const isMonoid = require('../predicates/isMonoid')

const identity = require('../combinators/identity')

const mconcatMap = require('./mconcatMap')

// mreduce :: Monoid M => M -> ([ a ] | List a) -> a
function mreduce(M, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mreduce: Monoid required for first argument')
  }
  else if(!(isFoldable(xs))) {
    throw new TypeError('mreduce: Foldable required for second argument')
  }

  return mconcatMap(M, identity, xs).value()
}

module.exports = curry(mreduce)
