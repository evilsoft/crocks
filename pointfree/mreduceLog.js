const curry       = require('../funcs/curry')
const isMonoid    = require('../internal/isMonoid')
const isFunction  = require('../internal/isFunction')

function mreduceLog(m, w) {
  if(!isMonoid(m)) {
    throw new TypeError('mreduceLog: First arg must be a Monoid')
  }

  if(!(m && isFunction(w.mreduceLog))) {
    throw new TypeError('mreduceLog: Second arg must be a Writer')
  }

  return w.mreduceLog(m)
}

module.exports = curry(mreduceLog)
