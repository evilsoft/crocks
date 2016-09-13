/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isMonoid = require('../internal/isMonoid')
const identity = require('../combinators/identity')
const isFunction = require('../internal/isFunction')

const mconcatMap = require('./mconcatMap')

// mconcat :: Monoid M => M -> [a] -> M a
function mconcat(M, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mconcat: Monoid required for first arg')
  }
  else if(!(xs && isFunction(xs.reduce))) {
    throw new TypeError('mconcat: Foldable required for second arg')
  }

  return mconcatMap(M, identity, xs)
}

module.exports = curry(mconcat)
