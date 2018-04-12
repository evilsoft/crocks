/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import _equals from '../core/equals.js'
import types from '../core/types.js'
const type = types.type('Prod')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import isNil from '../core/isNil.js'
import isNumber from '../core/isNumber.js'
import isSameType from '../core/isSameType.js'

const _empty =
  () => Prod(1)

function Prod(n) {
  const x = isNil(n) ? _empty().valueOf() : n

  if(!arguments.length || !isNumber(x)) {
    throw new TypeError('Prod: Numeric value required')
  }

  const valueOf =
    () => x

  const empty =
    _empty

  const inspect =
    () => `Prod${_inspect(valueOf())}`

  const equals =
    m => isSameType(Prod, m)
      && _equals(x, m.valueOf())

  function concat(m) {
    if(!isSameType(Prod, m)) {
      throw new TypeError('Prod.concat: Prod required')
    }

    return Prod(x * m.valueOf())
  }

  return {
    inspect, toString: inspect, valueOf,
    equals, type, concat, empty,
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat,
    ['@@type']: _type,
    constructor: Prod
  }
}

Prod['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Prod.empty = _empty
Prod.type = type

Prod[fl.empty] = _empty
Prod['@@type'] = _type

export default Prod
