/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const VERSION = 1

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Tuple')
const _type = require('../core/types').typeFn(type(), VERSION)

const isInteger = require('../core/isInteger')

function _Tuple(n, ...parts) {
  const inspect = () => `Tuple(${parts.map(_inspect).join(',')} )`
  return {
    constructor: _Tuple,
    inspect
  }
}

function Tuple(n) {
  if (!isInteger(n) || n < 1 || n > 10) {
    throw new TypeError('Tuple: Tuple size should be a number greater than 1')
  }

  switch (n) {
  case 1:
    return a => _Tuple(n, a)
  case 2:
    return (a, b) => _Tuple(n, a, b)
  case 3:
    return (a, b, c) => _Tuple(n, a, b, c)
  case 4:
    return (a, b, c, d) => _Tuple(n, a, b, c, d)
  case 5:
    return (a, b, c, d, e) => _Tuple(n, a, b, c, d, e)
  case 6:
    return (a, b, c, d, e, f) => _Tuple(n, a, b, c, d, e, f)
  case 7:
    return (a, b, c, d, e, f, g) => _Tuple(n, a, b, c, d, e, f, g)
  case 8:
    return (a, b, c, d, e, f, g, h) => _Tuple(n, a, b, c, d, e, f, g, h)
  case 9:
    return (a, b, c, d, e, f, g, h, i) => _Tuple(n, a, b, c, d, e, f, g, h, i)
  case 10:
    return (a, b, c, d, e, f, g, h, i, j) =>
      Tuple(n, a, b, c, d, e, f, g, h, i, j)
  }
}

Tuple.type = type
Tuple['@@type'] = _type

Tuple['@@implements'] = _implements([])

module.exports = Tuple
