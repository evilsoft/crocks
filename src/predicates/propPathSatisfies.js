/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evilsoft) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isEmpty  = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isPredOrFunc = require('../core/isPredOrFunc')
const isString = require('../core/isString')
const predOrFunc = require('../core/predOrFunc')

// propPathSatisfies: [ (String | Integer) ] -> (a -> Boolean) -> b -> Boolean
// propPathSatisfies: [ (String | Integer) ] -> Pred a -> b -> Boolean
function propPathSatisfies(keys, pred, x) {
  if(!isArray(keys)) {
    throw new TypeError(
      'propPathSatisfies: Array of Non-empty Strings or Integers required for first argument'
    )
  }

  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'propPathSatisfies: Pred or predicate function required for second argument'
    )
  }

  if(isNil(x)) {
    return false
  }

  let target = x
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(
        'propPathSatisfies: Array of Non-empty Strings or Integers required for first argument'
      )
    }

    if(isNil(target)) {
      return false
    }

    target = target[key]
  }

  return !!predOrFunc(pred, target)
}

module.exports = curry(propPathSatisfies)
