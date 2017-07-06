/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isObject = require('./core/isObject')
const object = require('./core/object')

// assign : Object -> Object -> Object
function assign(x, m) {
  if(!(isObject(x) && isObject(m))) {
    throw new TypeError('assign: Objects required for both arguments')
  }

  return object.assign(x, m)
}

module.exports = curry(assign)
