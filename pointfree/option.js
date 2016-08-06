const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

function option(x, m) {
  if(!(m && isFunction(m.option))) {
    throw new TypeError('option: Last arg must be a Maybe')
  }

  return m.option(x)
}

module.exports = curry(option)
