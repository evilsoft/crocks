/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('IO')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

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

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`IO.${method}: Function required`)
      }

      return IO(compose(fn, run))
    }
  }

  function ap(m) {
    if(!isSameType(IO, m)) {
      throw new TypeError('IO.ap: IO required')
    }
    return IO(() => {
      const fn = run()
      if(!isFunction(fn)) {
        throw new TypeError('IO.ap: Wrapped value must be a function')
      }

      return m.map(fn).run()
    })

  }

  function applyTo(method) {
    return function(liftedApply) {
      if(!isSameType(IO, liftedApply)) {
        throw new TypeError(`IO.${method}: IO required`)
      }
      return IO(() => {
        const x = run()
        return liftedApply.map(fn => {
          if(!isFunction(fn)) {
            throw new TypeError(`IO.${method}: Wrapped value must be a function`)
          }
          return fn(x)
        }).run()
      })
    }
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`IO.${method}: Function required`)
      }

      return IO(function() {
        const m = fn(run())

        if(!isSameType(IO, m)) {
          throw new TypeError(`IO.${method}: Function must return an IO`)
        }

        return m.run()
      })
    }
  }

  return {
    inspect, toString: inspect,
    run, type, ap, of,
    map: map('map'),
    chain: chain('chain'),
    applyTo: applyTo('applyTo'),
    [fl.ap]: applyTo(fl.ap),
    [fl.of]: of,
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
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

module.exports = IO
