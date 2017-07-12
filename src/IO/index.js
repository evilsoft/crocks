/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const compose = require('../core/compose')
const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const _type =
  constant('IO')

const _of =
  x => IO(constant(x))

function IO(run) {
  if(!isFunction(run)) {
    throw new TypeError('IO: Must wrap a function')
  }

  const type =
    _type

  const of =
    _of

  const inspect =
    constant(`IO${_inspect(run)}`)

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
    inspect, run, type,
    map, ap, of, chain
  }
}

IO.of =
  _of

IO.type =
  _type

IO['@@implements'] = _implements(
  [ 'ap', 'chain', 'map', 'of' ]
)

module.exports = IO
