/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 4

const _defineUnion = require('../core/defineUnion')
const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _innerConcat = require('../core/innerConcat')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Result')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const apOrFunc = require('../core/apOrFunc')
const compose = require('../core/compose')
const isApplicative = require('../core/isApplicative')
const isApply = require('../core/isApply')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')

const constant =
  x => () => x

const _result =
  _defineUnion({ Err: [ 'a' ], Ok: [ 'b' ] })

Result.Err =
  compose(Result, _result.Err)

Result.Ok =
  compose(Result, _result.Ok)

const _of =
  Result.Ok

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

  return x.map(_of)
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

  const of =
    _of

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

  function bichain(l, r) {
    const bichainErr =
      'Result.bichain: Both arguments must be Result returning functions'

    if(!(isFunction(l) && isFunction(r))) {
      throw new TypeError(bichainErr)
    }

    const m = either(l, r)

    if(!isSameType(Result, m)) {
      throw new TypeError(bichainErr)
    }

    return m
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
      constant(m.map(_of))
    )
  }

  return {
    inspect, toString: inspect, equals,
    type, either, swap, coalesce, bichain,
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

Result.of = _of
Result.type = type

Result[fl.of] = _of
Result['@@type'] = _type

Result['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)

module.exports = Result
