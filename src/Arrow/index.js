/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('Arrow')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const Pair = types.proxy('Pair')

const _id =
  () => Arrow(x => x)

function Arrow(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Arrow: Function required')
  }

  const inspect =
    () => `Arrow${_inspect(runWith)}`

  const id =
    _id

  const _map = fn =>
    Arrow(x => fn(runWith(x)))

  function compose(method) {
    return function(m) {
      if(!isSameType(Arrow, m)) {
        throw new TypeError(`Arrow.${method}: Arrow required`)
      }

      return _map(m.runWith)
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Arrow.${method}: Function required`)
      }

      return _map(fn)
    }
  }

  function contramap(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Arrow.${method}: Function required`)
      }

      return Arrow(x => runWith(fn(x)))
    }
  }

  function promap(method) {
    return function(l, r) {
      if(!isFunction(l) || !isFunction(r)) {
        throw new TypeError(`Arrow.${method}: Functions required for both arguments`)
      }

      return Arrow(x => r(runWith(l(x))))
    }
  }

  function first() {
    return Arrow(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Arrow.first: Pair required for inner argument')
      }
      return x.bimap(runWith, x => x)
    })
  }

  function second() {
    return Arrow(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Arrow.second: Pair required for inner argument')
      }

      return x.bimap(x => x, runWith)
    })
  }

  function both() {
    return Arrow(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Arrow.both: Pair required for inner argument')
      }
      return x.bimap(runWith, runWith)
    })
  }

  return {
    inspect, toString: inspect, type,
    runWith, id, first, second, both,
    compose: compose('compose'),
    map: map('map'),
    contramap: contramap('contramap'),
    promap: promap('promap'),
    [fl.id]: id,
    [fl.compose]: compose(fl.compose),
    [fl.map]: map(fl.map),
    [fl.contramap]: contramap(fl.contramap),
    [fl.promap]: promap(fl.promap),
    ['@@type']: _type,
    constructor: Arrow
  }
}

Arrow.id = _id
Arrow.type = type

Arrow[fl.id] = _id
Arrow['@@type'] = _type

Arrow['@@implements'] = _implements(
  [ 'compose', 'contramap', 'id', 'map', 'promap' ]
)

export default Arrow
