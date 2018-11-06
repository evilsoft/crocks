/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isObject = require('../core/isObject')
const isString = require('../core/isString')
const object = require('../core/object')

const isValid = x =>
  isObject(x) || isArray(x)

const pathError =
  'setPath: Non-empty Array of non-empty Strings and/or Integers required for first argument'

// setPath :: [ String | Integer ] -> a -> (Object | Array) -> (Object | Array)
function setPath(path, val, obj) {
  if(!isArray(path) || isEmpty(path)) {
    throw new TypeError(pathError)
  }

  if(!isValid(obj)) {
    throw new TypeError(
      'setPath: Object or Array required for third argument'
    )
  }

  const key = path[0]
  let newVal = val

  if(path.length > 1) {
    const next = !isValid(obj[key])
      ? isInteger(path[1]) ? [] : {}
      : obj[key]

    newVal = setPath(path.slice(1), val, next)
  }

  if(isString(key) && !isEmpty(key)) {
    return object.set(key, newVal, obj)
  }

  if(isInteger(key)) {
    return isArray(obj)
      ? array.set(key, newVal, obj)
      : object.set(key, newVal, obj)
  }

  throw new TypeError(pathError)
}

module.exports = curry(setPath)
