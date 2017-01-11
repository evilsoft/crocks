/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../internal/isFunction')

function evalWith(x, m) {
  if(!(m && isFunction(m.evalWith))) {
    throw new TypeError('evalWith: State required for second argument')
  }

  return m.evalWith(x)
}

module.exports = curry(evalWith)
