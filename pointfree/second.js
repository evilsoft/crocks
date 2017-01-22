/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isType = require('../internal/isType')
const identity = require('../combinators/identity')

function second(m) {
  if(isFunction(m)) {
    return function(x) {
      if(!(x && isType('Pair', x))) {
        throw new TypeError('first: Pair required as input')
      }

      return x.bimap(identity, m)
    }
  } else if(m && isFunction(m.second)) {
    return m.second()
  } else {
    throw new TypeError('second: Arrow or Function required')
  }
}

module.exports = second
