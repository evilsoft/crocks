/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../predicates/isFunction')
const isString = require('../predicates/isString')

// isSameType :: Container m => (String | m) -> m -> Boolean
function isSameType(type, m) {
  return  !!type && !!m
    && isFunction(type.type) && isFunction(m.type)
    && type.type() === m.type()
}

module.exports = curry(isSameType)
