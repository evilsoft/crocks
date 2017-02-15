/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const curry = require('../helpers/curry')

const List = require('../crocks/List')

// listToArray : e -> List a -> [ a ]
// listToArray : e -> (a -> List b) -> [ b ]
function listToArray(list) {
  if(isSameType(List, list)) {
    return list.toArray()
  }
  else if(isFunction(list)) {
    return function(x) {
      const m = list(x)

      if(!isSameType(List, m)) {
        throw new TypeError('listToArray: List returing function required')
      }

      return m.toArray()
    }
  }

  throw new TypeError('listToArray: List or List returing function required')
}

module.exports = curry(listToArray)
