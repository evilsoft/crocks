/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./core/implements')
const _inspect = require('./core/inspect')
const _object = require('./core/object')
const constant = require('./core/constant')
const isNil = require('./core/isNil')
const isObject = require('./core/isObject')
const isSameType = require('./core/isSameType')

const _empty =
  () => Assign({})

const _type =
  constant('Assign')

function Assign(o) {
  const x = isNil(o) ? _empty().value() : o

  if(!arguments.length || !isObject(x)) {
    throw new TypeError('Assign: Object required')
  }

  const value =
    constant(x)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Assign${_inspect(value())}`)

  function concat(m) {
    if(!isSameType(Assign, m)) {
      throw new TypeError('Assign.concat: Assign required')
    }

    return Assign(_object.assign(m.value(), x))
  }

  return { inspect, value, type, concat, empty }
}

Assign['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Assign.empty =
  _empty

Assign.type =
  _type

module.exports = Assign
