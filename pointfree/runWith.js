/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function runWith(x, m) {
  if(!(m && isFunction(m.runWith))) {
    throw new TypeError('run: Reader required for second argument')
  }

  return m.runWith(x)
}

module.exports = curry(runWith)
