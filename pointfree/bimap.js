const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

function bimap(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('bimap: Function required for first two args')
  }
  else if(!isFunction(m.bimap)) {
    throw new TypeError('bimap: Bifunctor required for third arg')
  }

  return m.bimap(f, g)
}

module.exports = curry(bimap)
