/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

import _equals from '../core/equals'
import _implements from '../core/implements'
import _innerConcat from '../core/innerConcat'
import _inspect from '../core/inspect'
import fl from '../core/flNames'

import isArray from '../core/isArray'
import isApply from '../core/isApply'
import isApplicative from '../core/isApplicative'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Identity')

const _type = typeFn(type(), VERSION)

export const of =
  Identity

export default function Identity(x) {
  if(!arguments.length) {
    throw new TypeError('Identity: Must wrap something')
  }

  const valueOf =
    () => x

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

    return x.map(of)
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

    return m.map(of)
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

Identity.of = of
Identity.type = type

Identity[fl.of] = of
Identity['@@type'] = _type

Identity['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)
