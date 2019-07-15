/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

const applyArgs = (fn, args) => {
  const toApply = args.splice(0, fn.length || args.length)

  return isFunction(fn) && toApply.length ? applyArgs(fn.apply(null, toApply), args) : fn
}

const applyUntil = a =>
  isFunction(a) ? applyUntil(a()) : a

function curryN(n, fn) {
  return function(...xs) {
    const args = xs.length ? xs : [ undefined ]
    const toApply = args.slice(0, Math.min(n, args.length))
    const remaining = Math.floor(n) - args.length
    const result = applyArgs(fn, toApply)

    return remaining > 0
      ? curryN(remaining, result)
      : applyUntil(result)
  }
}

module.exports = curryN
