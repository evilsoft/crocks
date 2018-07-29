/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

import _defineUnion from '../core/defineUnion'
import _equals from '../core/equals'
import _implements from '../core/implements'
import _innerConcat from '../core/innerConcat'
import _inspect from '../core/inspect'
import fl from '../core/flNames'

import apOrFunc from '../core/apOrFunc'
import compose from '../core/compose'
import isApplicative from '../core/isApplicative'
import isApply from '../core/isApply'
import isArray from '../core/isArray'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'
import isSemigroup from '../core/isSemigroup'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Result')

const _type = typeFn(type(), VERSION)

const constant =
  x => () => x

const _result =
  _defineUnion({ Err: [ 'a' ], Ok: [ 'b' ] })

export const Err =
  compose(Result, _result.Err)

export const Ok =
  compose(Result, _result.Ok)

export const of = Ok

const concatApErr =
  m => x => Result.Err(m.either(
    y => isSemigroup(x) && isSameType(y, x) ? x.concat(y) : x,
    () => x
  ))

const concatAltErr =
  r => l => Result.Err(isSemigroup(r) && isSameType(l, r) ? l.concat(r) : r)

function runSequence(x) {
  if(!(isApply(x) || isArray(x))) {
    throw new TypeError(
      'Result.sequence: Must wrap an Apply'
    )
  }

  return x.map(of)
}

function Result(u) {
  if(!arguments.length) {
    throw new TypeError('Result: Must wrap something, try using Err or Ok constructors')
  }

  const x =
    !_result.includes(u) ? _result.Ok(u) : u

  const equals =
    m => isSameType(Result, m) && either(
      x => m.either(y => _equals(y, x), constant(false)),
      x => m.either(constant(false), y => _equals(y, x))
    )

  const inspect = () =>
    either(
      l => `Err${_inspect(l)}`,
      r => `Ok${_inspect(r)}`
    )

  function either(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.either: Requires both invalid and valid functions')
    }

    return _result.caseOf({
      Err: f,
      Ok: g
    }, x)
  }

  function concat(method) {
    return function(m) {
      if(!isSameType(Result, m)) {
        throw new TypeError(`Result.${method}: Result of Semigroup required`)
      }

      return either(
        Result.Err,
        _innerConcat(`Result.${method}`, m)
      )
    }
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.swap: Requires both left and right functions')
    }

    return either(
      compose(Result.Ok, f),
      compose(Result.Err, g)
    )
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Result.coalesce: Requires both left and right functions')
    }

    return Result.Ok(either(f, g))
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Result.${method}: Function required`)
      }

      return either(
        Result.Err,
        compose(Result.Ok, fn)
      )
    }
  }

  function bimap(method) {
    return function(f, g) {
      if(!isFunction(f) || !isFunction(g)) {
        throw new TypeError(`Result.${method}: Requires both left and right functions`)
      }

      return either(
        compose(Result.Err, f),
        compose(Result.Ok, g)
      )
    }
  }

  function alt(method) {
    return function(m) {
      if(!isSameType(Result, m)) {
        throw new TypeError(`Result.${method}: Result required`)
      }

      return m.either(
        r => either(concatAltErr(r), Result.Ok),
        r => either(() => Result.Ok(r), Result.Ok)
      )
    }
  }

  function ap(m) {
    if(!isSameType(Result, m)) {
      throw new TypeError('Result.ap: Result required')
    }

    return either(
      concatApErr(m),
      function(fn) {
        if(!isFunction(fn)) {
          throw new TypeError('Result.ap: Wrapped value must be a function')
        }

        return m.either(Result.Err, () => m.map(fn))
      }
    )
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Result.${method}: Result returning function required`)
      }

      const m = either(Result.Err, fn)

      if(!isSameType(Result, m)) {
        throw new TypeError(`Result.${method}: Function must return a Result`)
      }

      return m
    }
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Result.sequence: Applicative TypeRep or Apply returning function required'
      )
    }

    const af =
      apOrFunc(f)

    return either(
      compose(af, Result.Err),
      runSequence
    )
  }

  function traverse(f, fn) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Result.traverse: Applicative TypeRep of Apply returning function required for first argument'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'Result.traverse: Apply returning functions required for both arguments'
      )
    }

    const af =
      apOrFunc(f)

    const m = either(compose(af, Result.Err), fn)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError('Result.traverse: Both functions must return an Apply of the same type')
    }

    return either(
      constant(m),
      constant(m.map(of))
    )
  }

  return {
    inspect, toString: inspect, equals,
    type, either, swap, coalesce,
    ap, of, sequence, traverse,
    alt: alt('alt'),
    bimap: bimap('bimap'),
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.alt]: alt(fl.alt),
    [fl.bimap]: bimap(fl.bimap),
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Result
  }
}

Result.Err = Err
Result.Ok = Ok
Result.of = of
Result.type = type

Result[fl.of] = of
Result['@@type'] = _type

Result['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)

export default Result
