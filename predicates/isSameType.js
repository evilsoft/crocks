/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isArray = require('./isArray')
const isFunction = require('./isFunction')
const isNil = require('./isNil')

function isAdt(x) {
  return !!x && isFunction(x.type)
}

function adtType(x, y) {
  return isAdt(x)
    && isAdt(y)
    && x.type() === y.type()
}

function typeName(x) {
  return isArray(x) ? 'array' : typeof x
}

function typeRep(x, y) {
  return x.name === y.constructor.name
    || y.name === x.constructor.name
}

// isSameType :: Container m => m -> m -> Boolean
function isSameType(x, y) {
  if(isAdt(x) || isAdt(y)) {
    return adtType(x, y)
  }

  if(isNil(x) || isNil(y)) {
    return x === y
  }

  return typeRep(x, y) || typeName(x) === typeName(y)
}

module.exports = curry(isSameType)
