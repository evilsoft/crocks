const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

const isApply = m => m && isFunction(m.ap) && isFunction(m.map)

function liftA(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA: First arg must be a function')
  }

  if(!isApply(m)) {
    throw new TypeError('liftA: Second arg must be an Apply')
  }

  return m.map(fn)
}

module.exports = curry(liftA)
