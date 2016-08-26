const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

function swap(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('swap: Function required for first two args')
  }
  else if(!isFunction(m.swap)) {
    throw new TypeError('swap: Either or Pair required for third arg')
  }

  return m.swap(f, g)
}

module.exports = curry(swap)
