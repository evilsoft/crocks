/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evilsoft) */

const curry = require('../core/curry')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isPredOrFunc = require('../core/isPredOrFunc')
const isString = require('../core/isString')
const predOrFunc = require('../core/predOrFunc')

// propSatisfies: (String | Integer) -> (a -> Boolean) -> b -> Boolean
// propSatisfies: (String | Integer) -> Pred a -> b -> Boolean
function propSatisfies(key, pred, x) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError(
      'propSatisfies: Non-empty String or Integer required for first argument'
    )
  }

  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'propSatisfies: Pred or predicate function required for second argument'
    )
  }

  return isNil(x) ? false : !!predOrFunc(pred, x[key])
}

module.exports = curry(propSatisfies)
