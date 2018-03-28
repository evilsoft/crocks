/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _equals = require('../core/equals')
const type = require('../core/types').type('First')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isSameType = require('../core/isSameType')

const Maybe = require('../core/Maybe')

const _empty =
  () => First(Maybe.Nothing())

function First(x) {
  if(!arguments.length) {
    throw new TypeError('First: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(x => x)

  const empty =
    _empty

  const inspect =
    () => `First(${_inspect(maybe)} )`

  const equals =
  m => isSameType(First, m)
    && _equals(maybe, m.valueOf())

  const valueOf =
    () => maybe

  const option =
    maybe.option

  function concat(m) {
    if(!isSameType(First, m)) {
      throw new TypeError('First.concat: First required')
    }

    const n =
      m.valueOf().map(x => x)

    return First(
      maybe.either(() => n, Maybe.Just)
    )
  }

  return {
    inspect, toString: inspect, equals,
    concat, empty, option, type,
    valueOf,
    [fl.equals]: equals,
    [fl.empty]: _empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: First
  }
}

First['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

First.empty = _empty
First.type = type

First[fl.empty] = _empty
First['@@type'] = _type

module.exports = First
