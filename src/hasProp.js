/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./core/curry')
const isString = require('./core/isString')
const isInteger = require('./core/isInteger')

// hasProp : (String | Number) -> a -> Boolean
function hasProp(key, x) {
  if(!(isString(key) || isInteger(key))) {
    throw new TypeError('hasProp: Number or String required for first argument')
  }

  return (!!x && x[key] !== undefined)
}

module.exports = curry(hasProp)
