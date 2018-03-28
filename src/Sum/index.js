/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _equals = require('../core/equals')
const type = require('../core/types').type('Sum')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const _empty =
  () => Sum(0)

function Sum(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Sum: Numeric value required')
  }

  const valueOf =
    () => x

  const empty=
    _empty

  const inspect =
    () => `Sum${_inspect(valueOf())}`

  const equals =
    m => isSameType(Sum, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Sum, m)) {
      throw new TypeError('Sum.concat: Sum required')
    }

    return Sum(x + m.valueOf())
  }

  return {
    inspect, toString: inspect, valueOf, equals,
    type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Sum
  }
}

Sum['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Sum.empty = _empty
Sum.type = type

Sum[fl.empty] = _empty
Sum['@@type'] = _type

module.exports = Sum
