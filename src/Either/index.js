/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

import _defineUnion from '../core/defineUnion.js'
import _equals from '../core/equals.js'
import _implements from '../core/implements.js'
import _innerConcat from '../core/innerConcat.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('Either')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import apOrFunc from '../core/apOrFunc.js'
import compose from '../core/compose.js'
import isArray from '../core/isArray.js'
import isApplicative from '../core/isApplicative.js'
import isApply from '../core/isApply.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const constant =
  x => () => x

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
    throw new TypeError('Either.sequence: Must wrap an Apply')
  }

  return x.map(_of)
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

  function concat(method) {
    return function(m) {
      if(!isSameType(Either, m)) {
        throw new TypeError(`Either.${method}: Either of Semigroup required`)
      }

      return either(
        Either.Left,
        _innerConcat(`Either.${method}`, m)
      )
    }
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

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Either.${method}: Function required`)
      }

      return either(Either.Left, compose(Either.Right, fn))
    }
  }

  function bimap(method) {
    return function(f, g) {
      if(!isFunction(f) || !isFunction(g)) {
        throw new TypeError(`Either.${method}: Requires both left and right functions`)
      }

      return either(
        compose(Either.Left, f),
        compose(Either.Right, g)
      )
    }
  }

  function alt(method) {
    return function(m) {
      if(!isSameType(Either, m)) {
        throw new TypeError(`Either.${method}: Either required`)
      }

      return either(
        constant(m),
        Either.Right
      )
    }
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

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Either.${method}: Function required`)
      }

      const m = either(Either.Left, fn)

      if(!isSameType(Either, m)) {
        throw new TypeError(`Either.${method}: Function must return an Either`)
      }

      return m
    }
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Either.sequence: Applicative TypeRep or Apply returning function required'
      )
    }

    const af =
      apOrFunc(f)

    return either(
      compose(af, Either.Left),
      runSequence
    )
  }

  function traverse(f, fn) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Either.traverse: Applicative TypeRep or Apply returning function required for first argument'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'Either.traverse: Apply returning function required for second argument'
      )
    }

    const af =
      apOrFunc(f)

    const m =
      either(compose(af, Either.Left), fn)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError(
        'Either.traverse: Both functions must return an Apply of the same type'
      )
    }

    return either(
      constant(m),
      constant(m.map(_of))
    )
  }

  return {
    inspect, toString: inspect, either,
    type, swap, coalesce, equals,
    ap, of, sequence, traverse,
    alt: alt('alt'),
    bimap: bimap('bimap'),
    concat: concat('concat'),
    chain: chain('chain'),
    map: map('map'),
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.alt]: alt(fl.alt),
    [fl.bimap]: bimap(fl.bimap),
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Either
  }
}

Either.of   = _of
Either.type = type

Either[fl.of] = _of
Either['@@type'] = _type

Either['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)

export default Either
