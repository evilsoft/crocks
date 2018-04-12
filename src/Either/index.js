/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

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
    type, concat, swap, coalesce, equals,
    map, bimap, alt, ap, of, chain, sequence,
    traverse,
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.alt]: alt,
    [fl.bimap]: bimap,
    [fl.concat]: concat,
    [fl.map]: map,
    [fl.chain]: chain,
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
