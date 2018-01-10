/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const List = require('.')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

// listToArray : List a -> [ a ]
// listToArray : (a -> List b) -> a -> [ b ]
function listToArray(list) {
  if(isFunction(list)) {
    return function(x) {
      const m = list(x)

      if(!isSameType(List, m)) {
        throw new TypeError('listToArray: List returning function required')
      }

      return m.toArray()
    }
  }

  if(isSameType(List, list)) {
    return list.toArray()
  }

  throw new TypeError('listToArray: List or List returning function required')
}

module.exports = curry(listToArray)
