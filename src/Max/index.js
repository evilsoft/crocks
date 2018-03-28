/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _equals = require('../core/equals')
const type = require('../core/types').type('Max')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Max(-Infinity)

function Max(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Max: Numeric value required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Max${_inspect(valueOf())}`

  const equals =
    m => isSameType(Max, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Max, m)) {
      throw new TypeError('Max.concat: Max requried')
    }

    return Max(Math.max(x, m.valueOf()))
  }

  return {
    inspect, toString: inspect, valueOf, equals,
    type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Max
  }
}

Max['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Max.empty = _empty
Max.type = type

Max[fl.empty] = _empty
Max['@@type'] = _type

module.exports = Max
