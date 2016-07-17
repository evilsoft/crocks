const curry = require('../funcs/curry')

const isFunction  = require('../internal/isFunction')
const isApply     = require('../internal/isApply')

function liftA2(fn, x, y) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA2: First arg must be a function')
  }

  if(!isApply(x) || !isApply(y)) {
    throw new TypeError('liftA2: Last two args must be a Applys')
  }

  return x.map(fn).ap(y)
}

module.exports = curry(liftA2)
