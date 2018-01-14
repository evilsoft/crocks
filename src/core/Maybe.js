/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _defineUnion = require('./defineUnion')
const _equals = require('./equals')
const _implements = require('./implements')
const _innerConcat = require('./innerConcat')
const _inspect = require('./inspect')
const type = require('./types').type('Maybe')

const compose = require('./compose')
const isApply = require('./isApply')
const isArray = require('./isArray')
const isFunction = require('./isFunction')
const isSameType = require('./isSameType')

const constant = x => () => x
const identity = x => x

const _maybe =
  _defineUnion({ Nothing: [], Just: [ 'a' ] })

const Nothing =
  _maybe.Nothing

const Just =
  _maybe.Just

Maybe.Nothing =
  compose(Maybe, Nothing)

Maybe.Just =
  compose(Maybe, Just)

const _of =
  compose(Maybe, Just)

const _zero =
  compose(Maybe, Nothing)

function runSequence(x) {
  if(!(isApply(x) || isArray(x))) {
    throw new TypeError('Maybe.sequence: Must wrap an Applicative')
  }

  return x.map(v => Maybe.of(v))
}

function Maybe(u) {
  if(!arguments.length) {
    throw new TypeError('Maybe: Must wrap something, try using Nothing or Just constructors')
  }

  const x =
    !_maybe.includes(u) ? Just(u) : u

  const of =
    _of

  const zero =
    _zero

  const option =
    n => either(constant(n), identity)

  const equals =
    m => isSameType(Maybe, m) && either(
      constant(m.either(constant(true), constant(false))),
      x => m.either(constant(false), y => _equals(y, x))
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
      compose(Maybe.Just, fn)
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

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Maybe.sequence: Applicative returning function required')
    }

    return either(
      compose(af, Maybe.Nothing),
      runSequence
    )
  }

  function traverse(af, f) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Maybe.traverse: Applicative returning functions required for both arguments')
    }

    const m = either(compose(af, Maybe.Nothing), f)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError('Maybe.traverse: Both functions must return an Applicative')
    }

    return either(
      constant(m),
      constant(m.map(v => Maybe(v)))
    )
  }

  return {
    inspect, either, option, type,
    concat, equals, coalesce, map, alt,
    zero, ap, of, chain, sequence, traverse,
    constructor: Maybe
  }
}

Maybe.of =
  _of

Maybe.type =
  type

Maybe.zero =
  _zero

Maybe['@@implements'] = _implements(
  [ 'alt', 'ap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse', 'zero' ]
)

module.exports = Maybe
