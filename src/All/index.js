/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('All')

const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')
const isSameType = require('../core/isSameType')

const _empty =
  () => All(true)

function All(b) {
  const x = isNil(b) ? _empty().value() : b

  if(!arguments.length || isFunction(x)) {
    throw new TypeError('All: Non-function value required')
  }

  const value =
    () => !!x

  const empty =
    _empty

  const inspect =
    () => `All${_inspect(value())}`

  function concat(m) {
    if(!isSameType(All, m)) {
      throw new TypeError('All.concat: All required')
    }

    return All(m.value() && value())
  }

  return { inspect, value, type, concat, empty }
}

All['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

All.empty =
  _empty

All.type =
  type

module.exports = All
