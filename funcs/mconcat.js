const curry       = require('./curry')
const isFunction  = require('../internal/isFunction')

const foldWith = m => (x, y) => x.concat(m(y))

function mconcat(M, xs) {
  if(!(M && isFunction(M.empty))) {
    throw new TypeError('mconcat: Requires Monoid for first arg')
  }

  if(!Array.isArray(xs)) {
    throw new TypeError('mconcat: Requires an array for second arg')
  }

  return xs.reduce(foldWith(M), M.empty()).value()
}

module.exports = curry(mconcat)
