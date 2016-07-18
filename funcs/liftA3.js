const curry = require('../funcs/curry')

const isFunction  = require('../internal/isFunction')
const isApply     = require('../internal/isApply')

function liftA3(fn, x, y, z) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA3: First arg must be a function')
  }

  if(!isApply(x) || !isApply(y) || !isApply(z)) {
    throw new TypeError('liftA3: Last three args must be a Applys')
  }

  return x.map(fn).ap(y).ap(z)
}

module.exports = curry(liftA3)
