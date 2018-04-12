/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('IO')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import compose from '../core/compose.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const _of =
  x => IO(() => x)

function IO(run) {
  if(!isFunction(run)) {
    throw new TypeError('IO: Must wrap a function')
  }

  const of =
    _of

  const inspect =
    () => `IO${_inspect(run)}`

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('IO.map: Function required')
    }

    return IO(compose(fn, run))
  }

  function ap(m) {
    if(!isSameType(IO, m)) {
      throw new TypeError('IO.ap: IO required')
    }

    return chain(f => m.map(f))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('IO.chain: Function required')
    }

    return IO(function() {
      const m = fn(run())

      if(!isSameType(IO, m)) {
        throw new TypeError('IO.chain: Function must return an IO')
      }

      return m.run()
    })
  }

  return {
    inspect, toString: inspect, run,
    type, map, ap, of, chain,
    [fl.of]: of,
    [fl.map]: map,
    [fl.chain]: chain,
    ['@@type']: _type,
    constructor: IO
  }
}

IO.of = _of
IO.type = type

IO[fl.of] = _of
IO['@@type'] = _type

IO['@@implements'] = _implements(
  [ 'ap', 'chain', 'map', 'of' ]
)

export default IO
