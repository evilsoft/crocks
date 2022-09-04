/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Ian Hofmann-Hicks (evilsoft) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isEmpty  = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isPredOrFunc = require('../core/isPredOrFunc')
const isString = require('../core/isString')
const predOrFunc = require('../core/predOrFunc')

const err = name =>
  `${name}: First argument must be an Array of non-empty Strings or Integers`

function fn(name) {
  /** pathSatisfies :: [ (String | Integer) ] -> (a -> Boolean) -> b -> Boolean */
  /** pathSatisfies :: [ (String | Integer) ] -> Pred a -> b -> Boolean */
  function pathSatisfies(keys, pred, x) {
    if(!isArray(keys)) {
      throw new TypeError(err(name))
    }

    if(!isPredOrFunc(pred)) {
      throw new TypeError(
        `${name}: Second argument must be a Pred or predicate Function`
      )
    }

    if(isNil(x)) {
      return false
    }

    let target = x
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
        throw new TypeError(err(name))
      }

      if(isNil(target)) {
        return false
      }

      target = target[key]
    }

    return !!predOrFunc(pred, target)
  }

  return curry(pathSatisfies)
}

const pathSatisfies =
  fn('pathSatisfies')

pathSatisfies.origFn =
  fn

module.exports = pathSatisfies
