/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isNil = require('./core/isNil')

// defaultTo : a -> b -> (a | b)
function defaultTo(def, val) {
  return isNil(val) ? def : val
}

module.exports = curry(defaultTo)
