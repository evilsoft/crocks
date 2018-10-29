/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pair = require('../core/types').proxy('Pair')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

function second(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!isSameType(Pair, x)) {
        throw new TypeError('second: Pair required as input')
      }

      return x.bimap(identity, m)
    }
  }

  if(m && isFunction(m.second)) {
    return m.second()
  }

  throw new TypeError('second: Strong Function or Profunctor required')
}

module.exports = second
