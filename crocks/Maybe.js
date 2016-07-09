const helpers     = require('../internal/helpers')
const isFunction  = helpers.isFunction
const isType      = helpers.isType

const isNothing = x => x === undefined || x === null

function Maybe(x) {
  if(arguments.length === 0) {
    throw new TypeError('Maybe must wrap something')
  }

  const of = Maybe.of

  function equals(m) {
    return isFunction(m.type)
      && type() === m.type()
      && x === m.maybe()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.map must be passed a function')
    }

    return Maybe(isNothing(x) ? null : fn(x))
  }

  function ap(m) {
    const fn = isNothing(x) ? () => null : x

    if(!isFunction(fn)) {
      throw new TypeError('Wrapped value must be a function for ap')
    }

    if(!isType(type(), m)) {
      throw new TypeError('Both containers need to be the same for ap')
    }

    return m.map(fn)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.chain must be passed a function')
    }

    return isNothing(x) ? Maybe(null) : map(fn).maybe()
  }

  const maybe = () => isNothing(x) ? null : x
  const type  = () => 'Maybe'

  return { of, equals, map, ap, chain, type, maybe }
}

Maybe.of = x => Maybe(x)

module.exports = Maybe
