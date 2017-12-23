/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Prod')

const isNil = require('../core/isNil')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

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

  function concat(m) {
    if(!isSameType(Prod, m)) {
      throw new TypeError('Prod.concat: Prod required')
    }

    return Prod(x * m.valueOf())
  }

  return {
    inspect, valueOf, type,
    concat, empty,
    constructor: Prod
  }
}

Prod['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

Prod.empty = _empty
Prod.type = type

module.exports = Prod
