/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _type = require('../core/types').type('Const')
const typeFn = require('../core/types').typeFn
const fl = require('../core/flNames')

const isFunction = require('../core/isFunction')
const isMonoid = require('../core/isMonoid')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')

const typeOrName =
  m => isFunction(m.type) ? m.type() : m.name

const constant = x => () => x

const empties = {
  Array: () => [],
  String: () => ''
}

const getEmpty = T =>
  T[fl.empty] || T.empty || empties[T.name]

const validMonoid = T =>
  isMonoid(T) || T.name === 'String' || T.name === 'Array'

function _Const(T) {
  if(!isFunction(T)) {
    throw new TypeError('Const: TypeRep required for construction')
  }

  const type =
    constant(_type(typeOrName(T)))

  const typeString =
    typeFn('Const', VERSION, typeOrName(T))

  function empty(method) {
    return function() {
      if(!validMonoid(T)) {
        throw new TypeError(`${type()}.${method}: Must be fixed to a Monoid`)
      }

      return Const(getEmpty(T)())
    }
  }

  function of(method) {
    return function() {
      if(!validMonoid(T)) {
        throw new TypeError(`${type()}.${method}: Must be fixed to a Monoid`)
      }

      return Const(getEmpty(T)())
    }
  }

  function Const(value) {
    if(!isSameType(T, value)) {
      throw new TypeError(`${type()}: ${typeOrName(T)} required`)
    }

    const inspect =
      constant(`${type()}${_inspect(value)}`)

    const valueOf =
      constant(value)

    const equals =
      m => isSameType(Const, m)
        && _equals(value, m.valueOf())

    function concat(method) {
      return function(m) {
        if(!isSemigroup(value)) {
          throw new TypeError(`${type()}.${method}: Must be fixed to a Semigroup`)
        }

        if(!isSameType(Const, m)) {
          throw new TypeError(`${type()}.${method}: ${type()} required`)
        }

        return Const(value.concat(m.valueOf()))
      }
    }

    function map(method) {
      return function(fn) {
        if(!isFunction(fn)) {
          throw new TypeError(`${type()}.${method}: Function required`)
        }

        return Const(value)
      }
    }

    function ap(m) {
      if(!isSemigroup(value)) {
        throw new TypeError(`${type()}.ap: Must be fixed to a Semigroup`)
      }

      if(!isSameType(Const, m)) {
        throw new TypeError(`${type()}.ap: ${type()} required`)
      }

      return Const(value.concat(m.valueOf()))
    }

    return {
      inspect, toString: inspect,
      valueOf, type, ap, equals,
      concat: concat('concat'),
      empty: empty('empty'),
      map: map('map'),
      of: of('of'),
      [fl.concat]: concat(fl.concat),
      [fl.empty]: empty(fl.empty),
      [fl.equals]: equals,
      [fl.map]: map(fl.map),
      [fl.of]: of(fl.of),
      ['@@type']: typeString,
      constructor: Const
    }
  }

  Const.empty = empty('empty')
  Const.of = of('of')
  Const.type = type

  Const[fl.empty] = empty(fl.empty)
  Const[fl.of] = of(fl.of)
  Const['@@type'] = typeString

  Const['@@implements'] = _implements(
    [ 'ap', 'concat', 'empty', 'equals', 'map', 'of' ]
  )

  return Const
}

module.exports = _Const
