const curry       = require('./curry')
const isFunction  = require('../internal/isFunction')
const isArray     = require('../internal/isArray')

const foldWith = m => (x, y) => x.concat(m(y))

// mconcat :: Monoid M => M -> [a] -> M a
function mconcat(M, xs) {
  if(!(M && isFunction(M.empty))) {
    throw new TypeError('mconcat: Monoid required for first arg')
  }
  else if(!isArray(xs)) {
    throw new TypeError('mconcat: Array required for second arg')
  }

  return xs.reduce(foldWith(M), M.empty())
}

module.exports = curry(mconcat)
