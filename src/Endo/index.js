/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('Endo')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import compose from '../core/compose.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

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

  function concat(m) {
    if(!isSameType(Endo, m)) {
      throw new TypeError('Endo.concat: Endo required')
    }

    return Endo(compose(m.valueOf(), valueOf()))
  }

  return {
    inspect, toString: inspect,
    valueOf, type, concat, empty,
    runWith,
    [fl.empty]: empty,
    [fl.concat]: concat,
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

export default Endo
