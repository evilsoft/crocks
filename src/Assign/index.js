/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _object = require('../core/object')
const _equals = require('../core/equals')

const type = require('../core/types').type('Assign')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isNil = require('../core/isNil')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')

const _empty =
  () => Assign({})

function Assign(o) {
  const x = isNil(o) ? _empty().valueOf() : o

  if(!arguments.length || !isObject(x)) {
    throw new TypeError('Assign: Object required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Assign${_inspect(valueOf())}`

  const equals =
    m => isSameType(Assign, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Assign, m)) {
      throw new TypeError('Assign.concat: Assign required')
    }

    return Assign(_object.assign(m.valueOf(), x))
  }

  return {
    inspect, toString: inspect,
    valueOf, equals, type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Assign
  }
}

Assign['@@implements'] = _implements(
  [ 'concat', 'empty', 'equals' ]
)

Assign.empty = _empty
Assign.type = type

Assign[fl.empty] = _empty
Assign['@@type'] = _type

module.exports = Assign
