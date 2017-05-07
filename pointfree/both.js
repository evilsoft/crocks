/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pair = require('../crocks/Pair')

function both(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!isSameType(Pair, x)) {
        throw new TypeError('both: Pair required as input')
      }

      return x.bimap(m, m)
    }
  }

  if(m && isFunction(m.both)) {
    return m.both()
  }

  throw new TypeError('both: Arrow, Function or Star required')
}

module.exports = both
