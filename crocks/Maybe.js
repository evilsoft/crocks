/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const constant  = require('../combinators/constant')

const _inspect = require('../funcs/inspect')

const isNothing = x => x === undefined || x === null

const _type = constant('Maybe')
const _of   = Maybe

function Maybe(x) {
  if(!arguments.length) {
    throw new TypeError('Maybe: Must wrap something')
  }

  const type    = _type
  const of      = _of

  const either  = (n, s) => isNothing(x) ? n() : s(x)
  const option  = n => either(constant(n), constant(x))
  const maybe   = constant(option(undefined))

  const equals  = m => isType(type(), m) && x === m.maybe()

  function inspect() {
    return either(
      constant(`Maybe.Nothing`),
      constant(`Maybe${_inspect(x)}`)
    )
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.map: Function required')
    }

    return Maybe(either(constant(undefined), fn))
  }

  function ap(m) {
    const fn = option(constant(undefined))

    if(!isFunction(fn)) {
      throw new TypeError('Maybe.ap: Wrapped value must be a function')
    }
    else if(!isType(type(), m)) {
      throw new TypeError('Maybe.ap: Maybe required')
    }

    return m.map(fn)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.chain: Function required')
    }

    return either(
      constant(Maybe(undefined)),
      constant(map(fn).maybe())
    )
  }

  return {
    inspect, maybe, either, option,
    type, equals, map, ap, of, chain
  }
}

Maybe.of    = _of
Maybe.type  = _type

module.exports = Maybe
