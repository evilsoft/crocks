/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('./implements')
const type = require('./types').type('Unit')
const _type = require('./types').typeFn(type(), VERSION)

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

  function concat(m) {
    if(!(isSameType(Unit, m))) {
      throw new TypeError('Unit.concat: Unit required')
    }

    return Unit()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Unit.map: Function required')
    }

    return Unit()
  }

  function ap(m) {
    if(!isSameType(Unit, m)) {
      throw new TypeError('Unit.ap: Unit required')
    }

    return Unit()
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Unit.chain: Function required')
    }

    return Unit()
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, concat, empty, map, ap,
    of, chain,
    'fantasy-land/of': of,
    'fantasy-land/empty': empty,
    'fantasy-land/equals': equals,
    'fantasy-land/concat': concat,
    'fantasy-land/map': map,
    'fantasy-land/chain': chain,
    '@@type': _type,
    constructor: Unit
  }
}

Unit.of = _of
Unit.empty = _empty
Unit.type = type

Unit['fantasy-land/of'] = _of
Unit['fantasy-land/empty'] = _empty
Unit['@@type'] = _type

Unit['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'empty', 'equals', 'map', 'of' ]
)

module.exports = Unit
