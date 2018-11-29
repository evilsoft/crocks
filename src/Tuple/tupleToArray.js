/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Jasmina Jacquelina (jasminabasurita) */

const Tuple = require('.')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const validTuple = m => {
  if(!isFunction(m.type)) {
    return false
  }
  const n = Number(m.type().slice(0,1))
  return isSameType(Tuple(n), m)
}

// tupleToArray : Tuple a -> [ a ]
// tupleToArray : (a -> Tuple b) -> a -> [ b ]
function tupleToArray(tuple) {
  if(isFunction(tuple)) {
    return function(x) {
      const m = tuple(x)

      if(!validTuple(m)) {
        throw new TypeError('tupleToArray: Tuple returning function required')
      }

      return m.toArray()
    }
  }

  if(validTuple(tuple)) {
    return tuple.toArray()
  }

  throw new TypeError('tupleToArray: Tuple or Tuple returning function required')
}

module.exports = curry(tupleToArray)

