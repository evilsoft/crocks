const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

function coalesce(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('coalesce: Function required for first two args')
  }
  else if(!isFunction(m.coalesce)) {
    throw new TypeError('coalesce: Either or Maybe or required for third arg')
  }

  return m.coalesce(f, g)
}

module.exports = curry(coalesce)
