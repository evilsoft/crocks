/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isArray = require('../predicates/isArray')

const allFuncs =
  xs => xs.reduce((b, i) => b && isFunction(i), true)

const map =
  (f, m) => m.map(x => f(x))

function ap(x, m) {
  if(!(m.length && allFuncs(m))) {
    throw new TypeError('Array.ap: Second Array must all be functions')
  }

  return m.reduce((acc, f) => acc.concat(map(f, x)), [])
}

function chain(f, m) {
  return m.reduce(function(y, x) {
    const n = f(x)

    if(!isArray(n)) {
      throw new TypeError('Array.chain: Function must return an Array')
    }

    return y.concat(n)
  }, [])
}

module.exports = {
  ap: ap,
  chain: chain,
  map: map
}
