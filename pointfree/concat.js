const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')
const isString    = require('../internal/isString')

const isSemiGroup = m => m.concat && isFunction(m.concat)

function concat(x, m) {
  if(!isSemiGroup(m)) {
    throw new TypeError('concat: Semi-group required for second arg')
  }

  if(isString(m)) { return m + x }

  return m.concat(x)
}

module.exports = curry(concat)
