/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isObject = require('../predicates/isObject')

const object = require('../internal/object')

// assign : Object -> Object -> Object
function assign(x, m) {
  if(!(isObject(x) && isObject(m))) {
    throw new TypeError('assign: Objects required for both arguments')
  }

  return object.assign(x, m)
}

module.exports = curry(assign)
