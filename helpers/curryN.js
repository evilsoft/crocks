/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isNumber = require('../internal/isNumber')
const isFunction = require('../internal/isFunction')
const argsArray = require('../internal/argsArray')

function curryN(n, fn) {
  if(!isNumber(n)) {
    throw new TypeError('curryN: Number required for first argument')
  }
  if(!isFunction(fn)) {
    throw new TypeError('curryN: Function required for second argument')
  }

  return function() {
    const xs =
      argsArray(arguments)

    const args =
      xs.length ? xs : [ undefined ]

    const remaining =
       Math.floor(n) - args.length

    return (remaining > 0)
      ? curryN(remaining, Function.bind.apply(fn, [ null ].concat(args)))
      : fn.apply(null, args.slice(0, n))
  }
}

module.exports = curryN
