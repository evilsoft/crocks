/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('./implements')
const type = require('./types').type('Unit')
const _type = require('./types').typeFn(type(), VERSION)
const fl = require('./flNames')

const isFunction = require('./isFunction')
const isSameType = require('./isSameType')

const _of =
  Unit

const _empty =
  Unit

function Unit() {
  const equals =
    m => isSameType(Unit, m)

  const inspect =
    () => '()'

  const valueOf =
    () => undefined

  const of =
    _of

  const empty =
    _empty

  function concat(method) {
    return function(m) {
      if(!isSameType(Unit, m)) {
        throw new TypeError(`Unit.${method}: Argument must be a Unit`)
      }

      return Unit()
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Unit.${method}: Argument must be a Function`)
      }

      return Unit()
    }
  }

  function ap(m) {
    if(!isSameType(Unit, m)) {
      throw new TypeError('Unit.ap: Argument must be a Unit')
    }

    return Unit()
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Unit.${method}: Argument must be a Function`)
      }

      return Unit()
    }
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, empty, ap, of,
    concat: concat('concat'),
    map: map('map'),
    chain: chain('chain'),
    [fl.of]: of,
    [fl.empty]: empty,
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Unit
  }
}

Unit.of = _of
Unit.empty = _empty
Unit.type = type

Unit[fl.of] = _of
Unit[fl.empty] = _empty
Unit['@@type'] = _type

Unit['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'empty', 'equals', 'map', 'of' ]
)

module.exports = Unit
