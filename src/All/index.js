/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('All')
const _type = require('../core/types').typeFn(type(), VERSION)

const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')
const isSameType = require('../core/isSameType')

const _empty =
  () => All(true)

function All(b) {
  const x = isNil(b) ? _empty().valueOf() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Non-function value required')
  }

  const valueOf =
    () => !!x

  const empty =
    _empty

  const inspect =
    () => `All${_inspect(valueOf())}`

  function concat(m) {
    if(!isSameType(All, m)) {
      throw new TypeError('All.concat: All required')
    }

    return All(m.valueOf() && valueOf())
  }

  return {
    inspect, toString: inspect,
    valueOf, type, concat, empty,
    '@@type': _type,
    'fantasy-land/concat': concat,
    'fantasy-land/empty': empty,
    constructor: All
  }
}

All['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

All.empty = _empty
All.type = type

All['fantasy-land/empty'] = _empty
All['@@type'] = _type

module.exports = All
