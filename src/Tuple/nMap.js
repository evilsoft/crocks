/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const Tuple = require('./index')

const validTuple = (n, m) =>
  isSameType(Tuple(n), m)

function runMap(m, fns) {
  const n = fns.length

  if (!validTuple(n, m)) {
    throw new TypeError(`nMap: ${n}-Tuple required`)
  }

  fns.forEach(fn => {
    if (!isFunction(fn)) {
      throw new TypeError('nMap: Functions required')
    }
  })

  return m.nMap(...fns)
}

function nMap(n) {
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
    throw new TypeError(
      'nMap: Integer between 1 and 10 required for first argument'
    )
  }
}

module.exports =
  curry(nMap)
