/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const identity = require('../combinators/identity')

const Pair = require('../crocks/Pair')

function second(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!isSameType(Pair, x)) {
        throw new TypeError('first: Pair required as input')
      }

      return x.bimap(identity, m)
    }
  } else if(m && isFunction(m.second)) {
    return m.second()
  } else {
    throw new TypeError('second: Arrow, Function or Star required')
  }
}

module.exports = second
