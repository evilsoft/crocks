/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _innerConcat = require('../core/innerConcat')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Identity')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isArray = require('../core/isArray')
const isApply = require('../core/isApply')
const isApplicative = require('../core/isApplicative')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const _of =
  Identity

function Identity(x) {
  if(!arguments.length) {
    throw new TypeError('Identity: Must wrap something')
  }

  const valueOf =
    () => x

  const of =
    _of

  const equals =
    m => isSameType(Identity, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `Identity${_inspect(x)}`

  function concat(method) {
    return function(m) {
      if(!isSameType(Identity, m)) {
        throw new TypeError(`Identity.${method}: Identity of Semigroup required`)
      }

      return _innerConcat(`Identity.${method}`, m)(x)
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Identity.${method}: Function required`)
      }

      return Identity(fn(x))
    }
  }

  function ap(m) {
    if(!isFunction(x)) {
      throw new TypeError('Identity.ap: Wrapped value must be a function')
    }

    else if(!isSameType(Identity, m)) {
      throw new TypeError('Identity.ap: Identity required')
    }

    return m.map(x)
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Identity.${method}: Function required`)
      }

      const m = fn(x)

      if(!isSameType(Identity, m)) {
        throw new TypeError(`Identity.${method}: Function must return an Identity`)
      }

      return m
    }
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Identity.sequence: Applicative TypeRep or Apply returning function required'
      )
    }

    if(!(isApply(x) || isArray(x))) {
      throw new TypeError('Identity.sequence: Must wrap an Apply')
    }

    return x.map(_of)
  }

  function traverse(f, fn) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Identity.traverse: Applicative TypeRep or Apply returning function required for first argument'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'Identity.traverse: Apply returning functions required for second argument'
      )
    }

    const m = fn(x)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError(
        'Identity.traverse: Both functions must return an Apply of the same type'
      )
    }

    return m.map(_of)
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, ap, of, sequence, traverse,
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Identity
  }
}

Identity.of = _of
Identity.type = type

Identity[fl.of] = _of
Identity['@@type'] = _type

Identity['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)

module.exports = Identity
