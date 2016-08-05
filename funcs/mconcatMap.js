const curry       = require('./curry')
const isFunction  = require('../internal/isFunction')
const isArray     = require('../internal/isArray')
const composeB    = require('../combinators/composeB')

const foldWith = m => (x, y) => x.concat(m(y))

// mconcatMap :: Monoid M => M -> (a -> b) -> [a] -> M b
function mconcatMap(M, f, xs) {
  if(!(M && isFunction(M.empty))) {
    throw new TypeError('mconcatMap: Monoid required for first arg')
  }
  else if(!isFunction(f)) {
    throw new TypeError('mconcatMap: Function required for second arg')
  }
  else if(!isArray(xs)) {
    throw new TypeError('mconcatMap: Array required for third arg')
  }

  return xs.reduce(foldWith(composeB(M, f)), M.empty())
}

module.exports = curry(mconcatMap)
