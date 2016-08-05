const curry       = require('../funcs/curry')
const isMonoid    = require('../internal/isMonoid')
const isFunction  = require('../internal/isFunction')

function mreduceLog(m, w) {
  if(!isMonoid(m)) {
    throw new TypeError('mreduceLog: Monoid required for first arg')
  }
  else if(!(m && isFunction(w.mreduceLog))) {
    throw new TypeError('mreduceLog: Writer required for second arg')
  }

  return w.mreduceLog(m)
}

module.exports = curry(mreduceLog)
