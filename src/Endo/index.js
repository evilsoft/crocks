/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Endo')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const _empty =
  () => Endo(x => x)

function Endo(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Endo: Function value required')
  }

  const valueOf =
    () => runWith

  const empty =
    _empty

  const inspect =
    () => `Endo${_inspect(valueOf())}`

  function concat(method) {
    return function(m) {
      if(!isSameType(Endo, m)) {
        throw new TypeError(`Endo.${method}: Endo required`)
      }

      return Endo(compose(m.valueOf(), valueOf()))
    }
  }

  return {
    inspect, toString: inspect,
    valueOf, type, empty, runWith,
    concat: concat('concat'),
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: Endo
  }
}

Endo['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Endo.empty = _empty
Endo.type = type

Endo[fl.empty] = _empty
Endo['@@type'] = _type

module.exports = Endo

