const curry = require('../funcs/curry')

const isFunction = require('../internal/isFunction')

function runWith(x, m) {
  if(!(m && isFunction(m.runWith))) {
    throw new TypeError('run: Secong arg must be a Reader')
  }

  return m.runWith(x)
}

module.exports = curry(runWith)
