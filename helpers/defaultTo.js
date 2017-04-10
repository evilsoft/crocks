/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isNil = require('../predicates/isNil')

// defaultTo : a -> b -> (a | b)
function defaultTo(def, val) {
  return isNil(val) ? def : val
}

module.exports = curry(defaultTo)
