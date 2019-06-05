/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _equals = require('../core/equals')
const type = require('../core/types').type('All')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')
const isSameType = require('../core/isSameType')

const _empty =
  () => All(true)

function All(b) {
  const x = isNil(b) ? _empty().valueOf() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Value must not be a Function')
  }

  const valueOf =
    () => !!x

  const empty =
    _empty

  const equals =
    m => isSameType(All, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `All${_inspect(valueOf())}`

  function concat(method) {
    return function(m) {
      if(!isSameType(All, m)) {
        throw new TypeError(`All.${method}: All required`)
      }

      return All(m.valueOf() && valueOf())
    }
  }

  return {
    inspect, toString: inspect,
    equals, valueOf, type, empty,
    ['@@type']: _type,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.empty]: empty,
    constructor: All
  }
}

All['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

All.empty = _empty
All.type = type

All[fl.empty] = _empty
All['@@type'] = _type

module.exports = All
