/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isArray = require('../predicates/isArray')

const curry = require('../helpers/curry')

const List = require('../crocks/List')

// arrayToList : e -> [ a ] -> List a
// arrayToList : e -> (a -> [ b ]) -> List b
function arrayToList(array) {
  if(isArray(array)) {
    return List.fromArray(array)
  }
  else if(isFunction(array)) {
    return function(x) {
      const g = array(x)

      if(!isArray(g)) {
        throw new TypeError('arrayToList: Array returing function required')
      }

      return List.fromArray(g)
    }
  }

  throw new TypeError('arrayToList: Array or Array returing function required')
}

module.exports = curry(arrayToList)
