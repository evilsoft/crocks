/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function coalesce(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('coalesce: Functions required for first two arguments')
  }
  else if(!isFunction(m.coalesce)) {
    throw new TypeError('coalesce: Either or Maybe required for third argument')
  }

  return m.coalesce(f, g)
}

module.exports = curry(coalesce)
