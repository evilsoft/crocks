const curry = require('../funcs/curry')

const isFunction = require('../internal/isFunction')

function runWith(x, m) {
  if(!(m && isFunction(m.runWith))) {
    throw new TypeError('run: Reader required for second arg')
  }

  return m.runWith(x)
}

module.exports = curry(runWith)
