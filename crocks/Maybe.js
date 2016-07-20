const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const constant  = require('../combinators/constant')

const isNothing = x => x === undefined || x === null

const _type = constant('Maybe')
const _of   = Maybe

function Maybe(x) {
  if(!arguments.length) {
    throw new TypeError('Maybe: Must wrap something')
  }

  const maybe = constant(isNothing(x) ? null : x)
  const type  = _type
  const of    = _of

  const equals = m => isType(type(), m) && x === m.maybe()

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.map: function required')
    }

    return Maybe(isNothing(x) ? null : fn(x))
  }

  function ap(m) {
    const fn = isNothing(x) ? constant(null) : x

    if(!isFunction(fn)) {
      throw new TypeError('Maybe.ap: Wrapped value must be a function')
    }

    if(!isType(type(), m)) {
      throw new TypeError('Maybe.ap: Maybe required')
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

Maybe.of    = _of
Maybe.type  = _type

module.exports = Maybe
