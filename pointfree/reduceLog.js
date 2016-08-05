const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

function reduceLog(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('reduceLog: Function required for first arg')
  }
  else if(!(m && isFunction(m.reduceLog))) {
    throw new TypeError('reduceLog: Writer required for second arg')
  }

  return m.reduceLog(fn)
}

module.exports = curry(reduceLog)
