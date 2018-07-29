/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isInteger from '../core/isInteger'
import isSameType from '../core/isSameType'
import Tuple from './index'

const validTuple = (n, m) =>
  isSameType(Tuple(n), m)

function runMap(m, fns) {
  const n = fns.length
  if (!validTuple(n, m)) {
    throw new TypeError(`nmap: ${n}-Tuple required`)
  }

  fns.forEach(fn => {
    if (!isFunction(fn)) {
      throw new TypeError('nmap: Functions required for all arguments')
    }
  })

  return m.mapAll(...fns)
}

const withLength = (n, fn) => {
  return Object.defineProperty(fn, 'length', {
    value: n
  })
}

function nmap(n) {
  if (!(isInteger(n) && n >= 1)) {
    throw new TypeError('nmap: Integer required for first argument')
  }

  switch (n) {
  case 1:
    return (a, m) =>
      runMap(m, [ a ])
  case 2:
    return (a, b, m) =>
      runMap(m, [ a, b ])
  case 3:
    return (a, b, c, m) =>
      runMap(m, [ a, b, c ])
  case 4:
    return (a, b, c, d, m) =>
      runMap(m, [ a, b, c, d ])
  case 5:
    return (a, b, c, d, e, m) =>
      runMap(m, [ a, b, c, d, e ])
  case 6:
    return (a, b, c, d, e, f, m) =>
      runMap(m, [ a, b, c, d, e, f ])
  case 7:
    return (a, b, c, d, e, f, g, m) =>
      runMap(m, [ a, b, c, d, e, f, g ])
  case 8:
    return (a, b, c, d, e, f, g, h, m) =>
      runMap(m, [ a, b, c, d, e, f, g, h ])
  case 9:
    return (a, b, c, d, e, f, g, h, i, m) =>
      runMap(m, [ a, b, c, d, e, f, g, h, i ])
  case 10:
    return (a, b, c, d, e, f, g, h, i, j, m) =>
      runMap(m, [ a, b, c, d, e, f, g, h, i, j ])
  default:
    return withLength(n + 1, function() {
      const parts = [].slice.call(arguments)
      return runMap(parts[parts.length - 1], parts.slice(0, parts.length - 1))
    })
  }
}

export default curry(nmap)
