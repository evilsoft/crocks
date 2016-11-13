/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const composeB = require('../combinators/composeB')
const isMonoid = require('../internal/isMonoid')
const isFunction = require('../internal/isFunction')

const foldWith =
  m => (x, y) => x.concat(m(y))

// mconcatMap :: Monoid M => M -> (b -> a) -> ([ b ] | List b) -> M a
function mconcatMap(M, f, xs) {
  if(!(M && isMonoid(M))) {
    throw new TypeError('mconcatMap: Monoid required for first argument')
  }
  else if(!isFunction(f)) {
    throw new TypeError('mconcatMap: Function required for second argument')
  }
  else if(!(xs && isFunction(xs.reduce))) {
    throw new TypeError('mconcatMap: Foldable required for third argument')
  }

  return xs.reduce(foldWith(composeB(M, f)), M.empty())
}

module.exports = curry(mconcatMap)
