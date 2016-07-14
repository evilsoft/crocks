const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

const isSemiGroup = m => m.concat && isFunction(m.concat)

function concat(x, m) {
  if(!isSemiGroup(m)) {
    throw new TypeError('concat: Second arg must be a Semi-group (incl. array or string)')
  }

  if(typeof m === 'string') { return m + x }

  return m.concat(x)
}

module.exports = curry(concat)
