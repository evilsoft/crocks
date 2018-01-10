/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./implements')
const type = require('./types').type('Unit')

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
    inspect, valueOf, type, equals,
    concat, empty, map, ap, of, chain,
    constructor: Unit
  }
}

Unit.type = type
Unit.of = _of
Unit.empty = _empty

Unit['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'empty', 'equals', 'map', 'of' ]
)

module.exports = Unit
