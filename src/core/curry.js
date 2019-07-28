/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

function applyCurry(fn, arg) {
  if(!isFunction(fn)) { return fn }

  return fn.length > 1 ? fn.bind(null, arg) : fn.call(null, arg)
}

// curry : ((a, b, c) -> d) -> a -> b -> c -> d
function curry(fn) {
  if(fn['@@crocks/curried']) { return fn }

  function curried(...xs) {
    const args =
      xs.length ? xs : [ undefined ]

    if(args.length < fn.length) {
      return curry(Function.bind.apply(fn, [ null ].concat(args)))
    }

    const val = args.length === fn.length
      ? fn.apply(null, args)
      : args.reduce(applyCurry, fn)

    if(isFunction(val)) {
      return curry(val)
    }

    return val
  }

  Object.defineProperty(curried, '@@crocks/curried', {
    enumerable: false,
    writable: false,
    value: true
  })

  return curried
}

module.exports = curry
