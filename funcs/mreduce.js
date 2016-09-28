/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isMonoid = require('../internal/isMonoid')
const identity = require('../combinators/identity')
const isFunction = require('../internal/isFunction')

const mconcatMap = require('./mconcatMap')

// mreduce :: Monoid M => M -> [a] -> a
function mreduce(M, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mreduce: Monoid required for first argument')
  }
  else if(!(xs && isFunction(xs.reduce))) {
    throw new TypeError('mreduce: Foldable required for second argument')
  }

  return mconcatMap(M, identity, xs).value()
}

module.exports = curry(mreduce)
