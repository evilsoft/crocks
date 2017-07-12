/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')

function fst(m) {
  if(!(m && isFunction(m.fst))) {
    throw new TypeError('fst: Pair required')
  }

  return m.fst()
}

module.exports = fst
