const curry       = require('./curry')
const isFunction  = require('../internal/isFunction')
const composeB    = require('../combinators/composeB')

const foldWith = m => (x, y) => x.concat(m(y))

// mconcatMap :: Monoid M => M -> (a -> b) -> [a] -> M b
function mconcatMap(M, f, xs) {
  if(!(M && isFunction(M.empty))) {
    throw new TypeError('mconcatMap: Requires Monoid for first arg')
  }

  if(!isFunction(f)) {
    throw new TypeError('mconcatMap: Requires function for second arg')
  }

  if(!Array.isArray(xs)) {
    throw new TypeError('mconcatMap: Requires an array for third arg')
  }

  return xs.reduce(foldWith(composeB(M, f)), M.empty()).value()
}

module.exports = curry(mconcatMap)
