/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _defineUnion = require('../core/defineUnion')
const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _innerConcat = require('../core/innerConcat')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Either')

const compose = require('../core/compose')
const isArray = require('../core/isArray')
const isApply = require('../core/isApply')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x

const _either =
  _defineUnion({ Left: [ 'a' ], Right: [ 'b' ] })

const { Left, Right } = _either

Either.Left =
  compose(Either, Left)

Either.Right =
  compose(Either, Right)

const _of =
  Either.Right

function runSequence(x) {
  if(!(isApply(x) || isArray(x))) {
    throw new TypeError('Either.sequence: Must wrap an Applicative')
  }

  return x.map(v => Either.of(v))
}

function Either(u) {
  if(!arguments.length) {
    throw new TypeError('Either: Must wrap something, try using Left or Right constructors')
  }

  const x = !_either.includes(u)
    ? Right(u)
    : u

  const equals =
    m => isSameType(Either, m) && either(
      x => m.either(y => _equals(y, x), constant(false)),
      x => m.either(constant(false), y => _equals(y, x))
    )

  const of =
    _of

  const inspect = constant(
    either(
      l => `Left${_inspect(l)}`,
      r => `Right${_inspect(r)}`
    )
  )

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.either: Requires both left and right functions')
    }

    return _either.caseOf({
      Left: f,
      Right: g
    }, x)
  }

  function concat(m) {
    if(!isSameType(Either, m)) {
      throw new TypeError('Either.concat: Either of Semigroup required')
    }

    return either(
      Either.Left,
      _innerConcat(Either, m)
    )
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.swap: Requires both left and right functions')
    }

    return either(
      compose(Either.Right, f),
      compose(Either.Left, g)
    )
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.coalesce: Requires both left and right functions')
    }

    return Either.Right(either(f, g))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.map: Function required')
    }

    return either(Either.Left, compose(Either.Right, fn))
  }

  function bimap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Either.bimap: Requires both left and right functions')
    }

    return either(
      compose(Either.Left, f),
      compose(Either.Right, g)
    )
  }

  function alt(m) {
    if(!isSameType(Either, m)) {
      throw new TypeError('Either.alt: Either required')
    }

    return either(
      constant(m),
      Either.Right
    )
  }

  function ap(m) {
    if(!either(constant(true), isFunction)) {
      throw new TypeError('Either.ap: Wrapped value must be a function')
    }

    else if(!either(constant(true), constant(isSameType(Either, m)))) {
      throw new TypeError('Either.ap: Either required')
    }

    return either(
      Either.Left,
      fn => m.map(fn)
    )
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.chain: Function required')
    }

    const m = either(Either.Left, fn)

    if(!isSameType(Either, m)) {
      throw new TypeError('Either.chain: Function must return an Either')
    }

    return m
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Either.sequence: Applicative returning function required')
    }

    return either(
      compose(af, Either.Left),
      runSequence
    )
  }

  function traverse(af, f) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Either.traverse: Applicative returning functions required for both arguments')
    }

    const m = either(compose(af, Either.Left), f)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError('Either.traverse: Both functions must return an Applicative')
    }

    return either(
      constant(m),
      constant(m.map(v => Either.of(v)))
    )
  }

  return {
    inspect, either, type, concat,
    swap, coalesce, equals, map, bimap,
    alt, ap, of, chain, sequence, traverse,
    constructor: Either
  }
}

Either.of   = _of
Either.type = type

Either['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)

module.exports = Either
