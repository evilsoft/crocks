/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isEmpty = require('../core/isEmpty')
const isInteger  = require('../core/isInteger')
const isObject  = require('../core/isObject')
const isString = require('../core/isString')

const array = require('../core/array')
const object = require('../core/object')

const pathError =
  'unsetPath: Non-empty Array of non-empty Strings and/or Positive Integers required for first argument'

/** unsetPath :: [ String | Integer ] -> a -> a */
function unsetPath(path, obj) {
  if(!isArray(path) || isEmpty(path)) {
    throw new TypeError(pathError)
  }

  if(!(isObject(obj) || isArray(obj))) {
    return obj
  }

  const key = path[0]

  if(!(isString(key) && !isEmpty(key) || isInteger(key) && key >= 0)) {
    throw new TypeError(pathError)
  }

  if(path.length === 1) {
    if(isArray(obj) && isInteger(key)) {
      return array.unset(key, obj)
    }

    if(isObject(obj) && isString(key)) {
      return object.unset(key, obj)
    }

    return obj
  }

  const next =
    obj[key]

  if(!(isObject(next) || isArray(next))) {
    return obj
  }

  if(isArray(obj)) {
    return array.set(key, unsetPath(path.slice(1), next), obj)
  }

  return object.set(key, unsetPath(path.slice(1), next), obj)
}

module.exports = curry(unsetPath)
