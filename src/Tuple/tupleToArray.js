/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Jasmina Jacquelina (jasminabasurita) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

/** tupleToArray :: Tuple a -> [ a ] */
/** tupleToArray :: (a -> Tuple b) -> a -> [ b ] */
function tupleToArray(tuple) {
  if(isFunction(tuple)) {
    return function(x) {
      const m = tuple(x)

      if(!isFunction(m.tupleLength)) {
        throw new TypeError('tupleToArray: Tuple returning function required')
      }

      return m.toArray()
    }
  }

  if(isFunction(tuple.tupleLength)) {
    return tuple.toArray()
  }

  throw new TypeError('tupleToArray: Tuple or Tuple returning function required')
}

module.exports = curry(tupleToArray)

