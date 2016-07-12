const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const isNothing = x => x === undefined || x === null

function Maybe(x) {
  if(!arguments.length) {
    throw new TypeError('Maybe must wrap something')
  }

  const maybe = () => isNothing(x) ? null : x
  const type  = () => 'Maybe'
  const of    = Maybe.of

  function equals(m) {
    return isFunction(m.type)
      && type() === m.type()
      && x === m.maybe()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.map: function required')
    }

    return Maybe(isNothing(x) ? null : fn(x))
  }

  function ap(m) {
    const fn = isNothing(x) ? () => null : x

    if(!isFunction(fn)) {
      throw new TypeError('Maybe.ap: Wrapped value must be a function')
    }

    if(!isType(type(), m)) {
      throw new TypeError(' Maybe.ap: Maybe required')
    }

    return m.map(fn)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.chain: function required')
    }

    return isNothing(x) ? Maybe(null) : map(fn).maybe()
  }


  return { maybe, type, equals, map, ap, of, chain }
}

Maybe.of = x => Maybe(x)

module.exports = Maybe
