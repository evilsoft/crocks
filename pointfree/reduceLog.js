const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

function reduceLog(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('reduceLog: First arg must be a function')
  }

  if(!(m && isFunction(m.reduceLog))) {
    throw new TypeError('reduceLog: second arg must be a Writer')
  }

  return m.reduceLog(fn)
}

module.exports = curry(reduceLog)
