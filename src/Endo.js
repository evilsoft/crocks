/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./core/implements')
const _inspect = require('./core/inspect')
const compose = require('./core/compose')
const constant = require('./core/constant')
const identity = require('./core/identity')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

const _empty =
  () => Endo(identity)

const _type =
  constant('Endo')

function Endo(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Endo: Function value required')
  }

  const value =
    constant(runWith)

  const type =
    _type

  const empty =
    _empty

  const inspect =
    constant(`Endo${_inspect(value())}`)

  function concat(m) {
    if(!isSameType(Endo, m)) {
      throw new TypeError('Endo.concat: Endo required')
    }

    return Endo(compose(m.value(), value()))
  }

  return { inspect, value, type, concat, empty, runWith }
}

Endo['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Endo.empty =
  _empty

Endo.type =
  _type

module.exports = Endo

