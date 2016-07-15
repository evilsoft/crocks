const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

// chain :: Chain m => (a -> m b) -> m a -> m b
function chain(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('chain: First arg must be a function')
  }

  if(!(m && isFunction(m.chain))) {
    throw new TypeError('chain: second arg must be a Chain of the same type')
  }

  return m.chain(fn)
}

module.exports = curry(chain)
