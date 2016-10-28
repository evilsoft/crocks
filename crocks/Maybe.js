/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('../internal/isApplicative')
const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const defineUnion = require('../internal/defineUnion')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')
const composeB = require('../combinators/composeB')

const _inspect = require('../funcs/inspect')

const _maybe = defineUnion({ Nothing: [], Just: [ 'a' ] })

const Nothing = _maybe.Nothing
const Just = _maybe.Just

const _of =
  composeB(Maybe, Just)

const _type=
  constant('Maybe')

function Maybe(u) {
  if(!arguments.length) {
    throw new TypeError('Maybe: Must wrap something, try using Nothing or Just constructors')
  }

  const x = (u && isFunction(u.tag) && (u.tag() === 'Nothing' || u.tag() === 'Just'))
    ? u : Just(u)

  const of =
    _of

  const type =
    _type

  const option =
    n => either(constant(n), identity)

  const maybe =
    constant(option(undefined))

  const equals =
    m => isType(type(), m) && either(
      constant(m.either(constant(true), constant(false))),
      constant(m.either(constant(false), constant(true)))
    ) && maybe() === m.maybe()

  function inspect() {
    return either(
      constant(`Maybe.Nothing`),
      x => `Maybe.Just${_inspect(x)}`
    )
  }

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Maybe.either: Requires both left and right functions')
    }

    return _maybe.caseOf({
      Nothing: f,
      Just: g
    }, x)
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Maybe.coalesce: Requires both left and right functions')
    }

    return Maybe.Just(either(f, g))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.map: Function required')
    }

    return either(
      Maybe.Nothing,
      composeB(Maybe.Just, fn)
    )
  }

  function ap(m) {
    const fn = option(constant(undefined))

    if(!isFunction(fn)) {
      throw new TypeError('Maybe.ap: Wrapped value must be a function')
    }
    else if(!isType(type(), m)) {
      throw new TypeError('Maybe.ap: Maybe required')
    }

    return either(
      Maybe.Nothing,
      m.map
    )
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Maybe.chain: Function required')
    }

    const m = either(Maybe.Nothing, fn)

    if(!(m && isType(type(), m))) {
      throw new TypeError('Maybe.chain: function must return a Maybe')
    }

    return m
  }

  function runSequence(x) {
    if(!isApplicative(x)) {
      throw new TypeError(`Maybe.sequence: Must wrap an Applicative`)
    }

    return x.map(Maybe.of)
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Maybe.sequence: Applicative returning function required')
    }

    return either(
      composeB(af, Maybe.Nothing),
      runSequence
    )
  }

  function traverse(f, af) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Maybe.traverse: Applicative returning functions required for both arguments')
    }

    const m = either(composeB(af, Maybe.Nothing), f)

    if(!isApplicative(m)) {
      throw new TypeError('Maybe.traverse: Both functions must return an Applicative')
    }

    return either(
      constant(m),
      constant(m.map(Maybe))
    )
  }

  return {
    inspect, maybe, either, option,
    type, equals, coalesce, map, ap,
    of, chain, sequence, traverse
  }
}

Maybe.of =
  _of

Maybe.type =
  _type

Maybe.Nothing =
  composeB(Maybe, Nothing)

Maybe.Just =
  composeB(Maybe, Just)

module.exports = Maybe
