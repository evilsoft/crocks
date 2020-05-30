/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 4

const _defineUnion = require('./defineUnion')
const _equals = require('./equals')
const _implements = require('./implements')
const _innerConcat = require('./innerConcat')
const _inspect = require('./inspect')
const type = require('./types').type('Maybe')
const _type = require('./types').typeFn(type(), VERSION)
const fl = require('./flNames')

const apOrFunc = require('./apOrFunc')
const compose = require('./compose')
const isApplicative = require('./isApplicative')
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
    throw new TypeError(
      'Maybe.sequence: Must wrap an Apply'
    )
  }

  return x.map(_of)
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

  function concat(method) {
    return function(m) {
      if(!isSameType(Maybe, m)) {
        throw new TypeError(`Maybe.${method}: Maybe of Semigroup required`)
      }

      return either(
        Maybe.Nothing,
        _innerConcat(`Maybe.${method}`, m)
      )
    }
  }

  function coalesce(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Maybe.coalesce: Requires both left and right functions')
    }

    return Maybe.Just(either(f, g))
  }

  function bichain(l, r) {
    const bichainErr =
      'Maybe.bichain: Both arguments must be Maybe returning functions'

    if(!(isFunction(l) && isFunction(r))) {
      throw new TypeError(bichainErr)
    }

    const m = either(l, r)

    if(!isSameType(Maybe, m)) {
      throw new TypeError(bichainErr)
    }

    return m
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Maybe.${method}: Function required`)
      }

      return either(
        Maybe.Nothing,
        compose(Maybe.Just, fn)
      )
    }
  }

  function alt(method) {
    return function(m) {
      if(!isSameType(Maybe, m)) {
        throw new TypeError(`Maybe.${method}: Maybe required`)
      }

      return either(
        constant(m),
        Maybe.Just
      )
    }
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

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Maybe.${method}: Function required`)
      }

      const m = either(Maybe.Nothing, fn)

      if(!isSameType(Maybe, m)) {
        throw new TypeError(`Maybe.${method}: Function must return a Maybe`)
      }

      return m
    }
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Maybe.sequence: Applicative TypeRep or Apply returning function required'
      )
    }

    const af =
      apOrFunc(f)

    return either(
      compose(af, Maybe.Nothing),
      runSequence
    )
  }

  function traverse(f, fn) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Maybe.traverse: Applicative TypeRep or Apply returning function required for first argument'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'Maybe.traverse: Apply returning function required for second argument'
      )
    }

    const af =
      apOrFunc(f)

    const m =
      either(compose(af, Maybe.Nothing), fn)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError(
        'Maybe.traverse: Both functions must return an Apply of the same type'
      )
    }

    return either(
      constant(m),
      constant(m.map(_of))
    )
  }

  return {
    inspect, toString: inspect, either,
    option, type, equals, bichain, coalesce,
    zero, ap, of, sequence,
    traverse,
    alt: alt('alt'),
    chain: chain('chain'),
    concat: concat('concat'),
    map: map('map'),
    [fl.zero]: zero,
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.alt]: alt(fl.alt),
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Maybe
  }
}

Maybe.of = _of
Maybe.zero = _zero
Maybe.type = type

Maybe[fl.of] = _of
Maybe[fl.zero] = _zero
Maybe['@@type'] = _type

Maybe['@@implements'] = _implements(
  [ 'alt', 'ap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse', 'zero' ]
)

module.exports = Maybe
