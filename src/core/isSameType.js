/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isFunction = require('./isFunction')
const type = require('./type')

/** isSameType :: Container m => (m, m) -> Boolean */
function isSameType(x, y) {
  const tX = type(x)
  const tY = type(y)

  return tX === tY
    || isFunction(x) && x.name === tY
    || isFunction(y) && y.name === tX
}

module.exports = curry(isSameType)
