/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Const')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

// todo: this is wrong, we need a Monoid of whatever type is on the left,
// and this needs to be defined as:
// const _of = x => Const(Monoid.mempty)
const _of =
  x => Const(x)

function Const(x) {
  if(!arguments.length) {
    throw new TypeError('Const: Must wrap something')
  }

  const equals =
    m => isSameType(Const, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `Const${_inspect(x)}`

  const valueOf =
    () => x

  function concat(method) {
    return function(m) {
      if(!isSameType(Const, m)) {
        throw new TypeError(`Const.${method}: Const required`)
      }

      return Const(x)
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Const.${method}: Function required`)
      }

      return Const(x)
    }
  }

  function ap(m) {
    if(!isSameType(Const, m)) {
      throw new TypeError('Const.ap: Const required')
    }

    return Const(x)
  }

  function applyTo(method) {
    return function(m){
      // todo: this isn't correct... Const is only an applicative if we have a Semigroup for the
      // inner value.
      // this should be defined as:
      // return Const(SemigroupOfA.mappend(x, m.valueOf()))
      //
      // but where shall we get an Semigroup from?
      // one might be to define a new type, ConstApplicative
      // and have a 'toApplicative(semigroup)' which defines 'ap'
      // would be used like: Const(5).toApplicative(NumberSemigroup).ap()
      if(!isSameType(Const, m)) {
        throw new TypeError(`Const.${method}: Const required`)
      }

      return Const(x)
    }
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Const.${method}: Function required`)
      }

      return Const(x)
    }
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, ap,
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    applyTo: applyTo('applyTo'),
    [fl.ap]: applyTo(fl.ap),
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Const
  }
}

Const.of = _of
Const.type = type

Const[fl.of] = _of
Const['@@type'] = _type

Const['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map' ]
)

module.exports = Const
