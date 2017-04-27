/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isObject = require('../predicates/isObject')

const object = require('../internal/object')

// defaultProps : Object -> Object -> Object
function defaultProps(x, m) {
  if(!isObject(x) || !isObject(m)) {
    throw new TypeError('defaultProps: Objects required for both arguments')
  }

  return object.assign(m, x)
}

module.exports = curry(defaultProps)
