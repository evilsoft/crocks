/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _defineUnion = require('../internal/defineUnion')
const _implements = require('../internal/implements')
const _innerConcat = require('../internal/innerConcat')
const _inspect = require('../internal/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')
const ifElse = require('../logic/ifElse')
const isApplicative = require('../predicates/isApplicative')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const _maybe = _defineUnion({ Nothing: [], Just: [ 'a' ] })

const Nothing = _maybe.Nothing
const Just = _maybe.Just

Maybe.Nothing =
  composeB(Maybe, Nothing)

Maybe.Just =
  composeB(Maybe, Just)

const _of =
  composeB(Maybe, Just)

const _type=
  constant('Maybe')

const _zero =
  composeB(Maybe, Nothing)

function Maybe(u) {
  if(!arguments.length) {
    throw new TypeError('Maybe: Must wrap something, try using Nothing or Just constructors')
  }

  const x = ifElse(_maybe.includes, identity, Just, u)

  const of =
    _of

  const type =
    _type

  const zero =
    _zero

  const option =
    n => either(constant(n), identity)

  const equals =
    m => isSameType(Maybe, m) && either(
      constant(m.either(constant(true), constant(false))),
      x => m.either(constant(false), y => y === x)
    )

  const inspect = () =>
    either(
      constant('Nothing'),
      x => `Just${_inspect(x)}`
    )

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Maybe.either: Requires both left and right functions')
    }

    return _maybe.caseOf({
      Nothing: f,
      Just: g
    }, x)
  }

  function concat(m) {
    if(!isSameType(Maybe, m)) {
      throw new TypeError('Maybe.concat: Maybe of Semigroup required')
    }

    return either(
      Maybe.Nothing,
      _innerConcat(Maybe, m)
    )
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

  function alt(m) {
    if(!isSameType(Maybe, m)) {
      throw new TypeError('Maybe.alt: Maybe required')
    }

    return either(
      constant(m),
      Maybe.Just
    )
  }

  function ap(m) {
    const fn = option(constant(undefined))

    if(!isFunction(fn)) {
      throw new TypeError('Maybe.ap: Wrapped value must be a function')
    }
    else if(!isSameType(Maybe, m)) {
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

    if(!isSameType(Maybe, m)) {
      throw new TypeError('Maybe.chain: Function must return a Maybe')
    }

    return m
  }

  function runSequence(x) {
    if(!isApplicative(x)) {
      throw new TypeError('Maybe.sequence: Must wrap an Applicative')
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

  function traverse(af, f) {
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
    inspect, either, option, type,
    concat, equals, coalesce, map, alt,
    zero, ap, of, chain, sequence,
    traverse
  }
}

Maybe.of =
  _of

Maybe.type =
  _type

Maybe.zero =
  _zero

Maybe['@@implements'] = _implements(
  [ 'alt', 'ap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse', 'zero' ]
)

module.exports = Maybe
