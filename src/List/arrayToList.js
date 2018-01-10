/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const List = require('.')

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')

// arrayToList : [ a ] -> List a
// arrayToList : (a -> [ b ]) -> a -> List b
function arrayToList(array) {
  if(isArray(array)) {
    return List.fromArray(array)
  }
  else if(isFunction(array)) {
    return function(x) {
      const g = array(x)

      if(!isArray(g)) {
        throw new TypeError('arrayToList: Array returning function required')
      }

      return List.fromArray(g)
    }
  }

  throw new TypeError('arrayToList: Array or Array returning function required')
}

module.exports = curry(arrayToList)
