/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')

const isFunction = require('../predicates/isFunction')
const isMonoid = require('../predicates/isMonoid')

const mconcatMap = require('./mconcatMap')

// mreduceMap :: Monoid M => M -> (b -> a) -> ( [ b ] | List b ) -> a
function mreduceMap(M, f, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mreduceMap: Monoid required for first argument')
  }
  else if(!isFunction(f)) {
    throw new TypeError('mreduceMap: Function required for second argument')
  }
  else if(!(xs && isFunction(xs.reduce))) {
    throw new TypeError('mreduceMap: Foldable required for third argument')
  }

  return mconcatMap(M, f, xs).value()
}

module.exports = curry(mreduceMap)
